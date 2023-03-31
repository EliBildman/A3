const Manager = require('../managers/head-manager');
const Constants = require('../constants');

const log = require('../loggers/head-logger')('Utils');

const data_cache = {};

const events = {};

const cache = {
  name: 'cache',
  triggers: [],
  input: [
    {
      name: 'field',
      type: Constants.TYPES.STRING,
      input: Constants.INPUT.RAW,
    },
    {
      name: 'value',
      type: Constants.TYPES.ANY,
      input: Constants.INPUT.EITHER,
    },
  ],
  output: [],
  run: (_, payload, props) => {
    const field = props.field;
    const value = Manager.getValue(props.value, payload);
    data_cache[field] = value;
  },
  direct_connections: true,
};

const decache = {
  name: 'decache',
  triggers: [],
  input: [
    {
      name: 'field',
      type: Constants.TYPES.STRING,
      input: Constants.INPUT.RAW,
    },
  ],
  output: [
    {
      name: '!field',
      type: Constants.TYPES.ANY,
    },
  ],
  run: (_, payload, props) => {
    const field = props.field;
    payload[field] = data_cache[field];
  },
  direct_connections: true,
};

const set = {
  name: 'set',
  triggers: [],
  input: [
    {
      name: 'field',
      type: Constants.TYPES.STRING,
      input: Constants.INPUT.RAW,
    },
    {
      name: 'value',
      type: Constants.TYPES.ANY,
      input: Constants.INPUT.RAW,
    },
  ],
  output: [
    {
      name: '!field',
      type: Constants.TYPES.LOOKUP,
      lookup: 'value',
    },
  ],
  run: (triggers, payload, props) => {
    const field = props.field;
    const value = props.value;
    payload[field] = value;
  },
  direct_connections: true,
};

const fork = {
  name: 'fork',
  triggers: ['Left', 'Right'],
  input: [],
  output: [],
  run: (triggers, payload, props) => {
    const { runLeft, runRight } = triggers;
    runLeft();
    runRight();
  },
  direct_connections: false,
};

const _if = {
  name: 'if',
  triggers: ['True', 'False'],
  input: [
    {
      name: 'a',
      type: Constants.TYPES.ANY,
      input: Constants.INPUT.EITHER,
    },
    {
      name: 'operator',
      type: Constants.TYPES.ENUM,
      input: Constants.INPUT.RAW,
      options: ['<', '>', '=', '<=', '>='],
    },
    {
      name: 'b',
      type: Constants.TYPES.ANY,
      input: Constants.INPUT.EITHER,
    },
  ],
  output: [],
  run: (triggers, payload, props) => {
    const { runTrue, runFalse } = triggers;
    const a = Manager.getValue(props.a, payload);
    const b = Manager.getValue(props.b, payload);
    if (props.operator == '<') {
      if (a < b) runTrue();
      else runFalse();
      return;
    }
    if (props.operator == '>') {
      if (a > b) runTrue();
      else runFalse();
      return;
    }
    if (props.operator == '=') {
      if (a == b) runTrue();
      else runFalse();
      return;
    }
    if (props.operator == '<=') {
      if (a <= b) runTrue();
      else runFalse();
      return;
    }
    if (props.operator == '>=') {
      if (a >= b) runTrue();
      else runFalse();
      return;
    }
  },
  direct_connections: true,
};

const print = {
  name: 'print',
  triggers: [],
  input: [
    {
      name: 'value',
      type: Constants.TYPES.ANY,
      input: Constants.INPUT.EITHER,
    },
  ],
  output: [],
  run: (_, payload, props) => {
    if (props.value == '') {
      log.info(payload);
      return;
    }
    const value = Manager.getValue(props.value, payload);
    log.info(value);
  },
  direct_connections: true,
};

const actions = {
  set,
  fork,
  if: _if,
  print,
  cache,
  decache,
};

const sockets = {};

const head = {
  name: 'Utils',
  events,
  actions,
  sockets,
};

module.exports.initialize = () => {
  Manager.register(head);
};
