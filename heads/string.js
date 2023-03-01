const Manager = require('../managers/head-manager');
const Constants = require('../constants');

const events = {};

const substring = {
    name: 'substring',
    triggers: [],
    input: [
        {
            name: 'field',
            type: Constants.TYPES.STRING,
            input: Constants.INPUT.RAW,
        },
        {
            name: 'start',
            type: Constants.TYPES.NUMBER,
            input: Constants.INPUT.RAW,
        },
        {
            name: 'end',
            type: Constants.TYPES.NUMBER,
            input: Constants.INPUT.RAW,
        },
    ],
    output: [
        {
            name: '!field',
            type: Constants.TYPES.STRING,
        },
    ],
    run: (triggers, payload, props) => {
        const field = props.field;
        const start = props.start;
        const end = props.end;
        const str = payload[field];

        payload[field] = str.substring(start, end);
    },
    direct_connections: true,
};

const contains = {
    name: 'contains',
    triggers: ['True', 'False'],
    input: [
        {
            name: 'look_for',
            type: Constants.TYPES.STRING,
            input: Constants.INPUT.EITHER,
        },
        {
            name: 'string',
            type: Constants.TYPES.STRING,
            input: Constants.INPUT.EITHER,
        },
    ],
    output: [],
    run: (triggers, payload, props) => {
        const { runTrue, runFalse } = triggers;

        const str = Manager.getValue(props.string, payload);
        const substr = Manager.getValue(props.look_for, payload);

        if (str.includes(substr)) {
            runTrue();
        } else {
            runFalse();
        }
    },
    direct_connections: true,
};

const actions = {
    substring,
    contains,
};

const sockets = {};

const head = {
    name: 'String',
    events,
    actions,
    sockets,
};

module.exports.initialize = () => {
    Manager.register(head);
};
