const Manager = require('../managers/head-manager');
const Constants = require('../constants');

let devices = {};

// fired every time temperature changes
const onCode = {
    name: 'onCode',
    props: [
        {
            name: 'code',
            type: Constants.TYPES.STRING,
        },
        {
            name: 'pad_name',
            type: Constants.TYPES.STRING,
        },
    ],
    fire: () => {}, // gets set in registration
    output: [
        {
            name: 'name',
            type: Constants.TYPES.STRING,
        }, {
            name: 'code',
            type: Constants.TYPES.STRING,
        }
    ],
};

const events = {
    onCode,
};

const actions = {};

const getMessageHandler = (device) => (message) => {
    onCode.fire(
        (props) => {
            // optional name, can be null
            return (
                (!props.pad_name || props.name === device.name) &&
                (!props.code || props.code === message)
            );
        },
        { name: device.name, code: message }
    );
};

const keypad_socket = {
    id: 'keypad_socket',
    onConnect: (device, initial_message) => {
        device.name = initial_message; // init message is name
        devices[device.name] = device;
        device.setMessageCallback(getMessageHandler(device));
        device.setCloseCallback(() => {
            delete devices[device.name];
            console.log(`${device.name} closed`);
        });
        console.log(`Connected Keypad: ${device.name}`);
    },
};

const sockets = {
    keypad_socket,
};

const head = {
    name: 'Keypad',
    events,
    actions,
    sockets,
};

module.exports.initialize = () => {
    Manager.register(head);
};
