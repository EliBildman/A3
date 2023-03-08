const Manager = require('../managers/head-manager');
const Constants = require('../constants');

const events = {};

const substring = {
    name: 'substring',
    triggers: [],
    input: [
        {
            name: 'string',
            type: Constants.TYPES.STRING,
            input: Constants.INPUT.VARIABLE,
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
            name: '!string',
            type: Constants.TYPES.STRING,
        },
    ],
    run: (triggers, payload, props) => {
        const string = Manager.getValue(props.string, payload);
        const str_field = Manager.getField(props.string);
        const start = props.start;
        const end = props.end;

        if (end !== null && end !== undefined) {
            payload[str_field] = string.substring(start, end);
        } else {
            payload[str_field] = string.substring(start);
        }
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

const charAt = {
    name: 'charAt',
    triggers: [],
    input: [
        {
            name: 'string',
            type: Constants.TYPES.STRING,
            input: Constants.INPUT.VARIABLE,
        },
        {
            name: 'index',
            type: Constants.TYPES.STRING,
            input: Constants.INPUT.RAW,
        },
    ],
    output: [
        {
            name: 'char',
            type: Constants.TYPES.STRING,
        },
    ],
    run: (triggers, payload, props) => {
        const string = Manager.getValue(props.string, payload);
        const index = props.index;
        let char = '';
        if (string) {
            char = string.charAt(index);
        }
        payload.char = char;
    },
    direct_connections: true,
};

const actions = {
    substring,
    contains,
    charAt,
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
