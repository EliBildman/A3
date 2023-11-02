const Manager = require('../managers/head-manager');
const Constants = require('../constants');
const log = require('../loggers/head-logger')('Func');

// ----------------- EVENTS ----------------- //

const define = {
  name: 'define',
  props: [{ name: 'name', type: Constants.TYPES.STRING }],
  fire: () => {}, // gets set in registration
  output: [],
};

// ----------------- ACTIONS ----------------- //

const run = {
  name: 'run',
  triggers: [],
  input: [
    {
      name: 'name',
      type: Constants.TYPES.STRING,
      input: Constants.INPUT.RAW,
    },
  ],
  output: [],
  run: (triggers, payload, props) => {
    const funcName = props.name;
    if (funcName) {
      define.fire((props) => {
        return props.name === funcName;
      });
    } else {
      log.error('No function name provided');
    }
  },
  direct_connections: true,
};

// ----------------- SOCKETS ----------------- //

// ----------------- REGISTRATION ----------------- //

const events = {
  define,
};

const actions = {
  run,
};

const sockets = {};

const head = {
  name: 'Func',
  events,
  actions,
  sockets,
};

module.exports.initialize = () => {
  Manager.register(head);
};
