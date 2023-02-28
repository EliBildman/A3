const Manager = require('../managers/head-manager');
const Constants = require('../constants');

let devices = {};

// fired every time temperature changes
const onChange = {
    name: 'onChange',
    props: [{ name: 'name', type: Constants.TYPES.STRING }],
    fire: () => {}, // gets set in registration
    output: [],
};

// fired when temp crosses below to above 'value'
const onOver = {
    name: 'onOver',
    props: [
        { name: 'name', type: Constants.TYPES.STRING },
        { name: 'value', type: Constants.TYPES.NUMBER },
    ],
    fire: () => {},
    output: [],
};

// fired when temp crosses above to below 'value'
const onUnder = {
    name: 'onUnder',
    props: [
        { name: 'name', type: Constants.TYPES.STRING },
        { name: 'value', type: Constants.TYPES.NUMBER },
    ],
    fire: () => {},
    output: [],
};

const events = {
    onChange,
    onOver,
    onUnder,
};

const actions = {};

const getMessageHandler = (device) => (message) => {
    const temp = parseFloat(message);
    if (temp !== device.temp) {
        onChange.fire(
            (props) => {
                return props.name === device.name;
            },
            { temp } // send in temperature as payload
        );
        onOver.fire((props) => {
            return device.temp <= props.value && temp > props.value;
        });
        onUnder.fire((props) => {
            return device.temp >= props.value && temp < props.value;
        });
    }
    device.temp = temp;
};

const thermo_socket = {
    id: 'thermo_socket',
    onConnect: (device, initial_message) => {
        device.name = initial_message; // init message is name
        devices[device.name] = device;
        device.setMessageCallback(getMessageHandler(device));
        device.setCloseCallback(() => {
            delete devices[device.name];
            console.log(`${device.name} closed`);
        });
        console.log(`Connected Thermo: ${device.name}`);
    },
};

const sockets = {
    thermo_socket,
};

const head = {
    name: 'Thermo',
    events,
    actions,
    sockets,
};

module.exports.initialize = () => {
    Manager.register(head);
};
