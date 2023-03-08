const Manager = require('../managers/head-manager');
const Constants = require('../constants');

const _do = {
    name: 'do',
    triggers: [],
    input: [
        {
            name: 'operator',
            type: Constants.TYPES.ENUM,
            input: Constants.INPUT.RAW,
            options: ['+', '-', '/', '*', '%'],
        },
        {
            name: 'a',
            type: Constants.TYPES.NUMBER,
            input: Constants.INPUT.EITHER,
        },
        {
            name: 'b',
            type: Constants.TYPES.NUMBER,
            input: Constants.INPUT.EITHER,
        },
    ],
    output: [
        {
            name: 'ans',
            type: Constants.TYPES.NUMBER,
        },
    ],
    run: (triggers, payload, props) => {
        const operator = props.operator;
        const a = Manager.getValue(props.a, payload);
        const b = Manager.getValue(props.b, payload);

        let ans = 0;

        if (operator === '+') {
            ans = a + b;
        }
        if (operator === '-') {
            ans = a - b;
        }
        if (operator === '/') {
            ans = a / b;
        }
        if (operator === '*') {
            ans = a * b;
        }
        if (operator === '%') {
            ans = a % b;
        }

        payload['ans'] = ans;
    },
    direct_connections: true,
};

const events = {};

const actions = {
    substring: _do,
};

const sockets = {};

const head = {
    name: 'Math',
    events,
    actions,
    sockets,
};

module.exports.initialize = () => {
    Manager.register(head);
};
