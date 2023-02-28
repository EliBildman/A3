const Manager = require('../managers/head-manager');
const Constants = require('../constants');

const events = {};

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
    direct_connections: false,
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
    run: (triggers, payload, props) => {
        if (props.value == '') {
            console.log(payload);
            return;
        }
        const value = Manager.getValue(props.value, payload);
        console.log(value);
    },
    direct_connections: true,
};

const foo = {
    name: 'foo',
    triggers: [],
    input: [
        {
            name: 'alpha',
            type: Constants.TYPES.STRING,
            input: Constants.INPUT.RAW,
        },
        {
            name: 'beta',
            type: Constants.TYPES.NUMBER,
            input: Constants.INPUT.RAW,
        },
        {
            name: 'treta',
            type: Constants.TYPES.ENUM,
            input: Constants.INPUT.RAW,
            options: ['one', 'two', 'three'],
        },
        {
            name: 'delta',
            type: Constants.TYPES.BOOL,
            input: Constants.INPUT.RAW,
        },
        {
            name: 'eatme',
            type: Constants.TYPES.ANY,
            input: Constants.INPUT.RAW,
        },
        {
            name: 'stonk',
            type: Constants.TYPES.ANY,
            input: Constants.INPUT.EITHER,
        },
    ],
    output: [
        {
            name: 'getta',
            type: Constants.TYPES.NUMBER,
        },
        {
            name: 'keyta',
            type: Constants.TYPES.STRING,
        },
    ],
    run: (triggers, payload, props) => {},
    direct_connections: true,
};

const actions = {
    set,
    fork,
    if: _if,
    print,
    foo,
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
