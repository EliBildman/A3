const Manager = require('../managers/head-manager');
const Constants = require('../constants');
const { Client } = require('tplink-smarthome-api');

const log = require('../loggers').HeadLogger('TpPlug');

const plugs = {};

const events = {};

const on = {
    name: 'on',
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
        const name = props.name;
        if (name in plugs) {
            plugs[name].setPowerState(true);
        }
    },
    direct_connections: true,
};

const off = {
    name: 'off',
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
        const name = props.name;
        if (name in plugs) {
            plugs[name].setPowerState(false);
        }
    },
    direct_connections: true,
};

const actions = {
    on,
    off,
};

const sockets = {};

const head = {
    name: 'TPPlug',
    events,
    actions,
    sockets,
};

module.exports.initialize = () => {
    Manager.register(head);

    const client = new Client();
    const discoveryOptions = {
        // discoveryTimeout: 5000, poll forever? incase new plug gets activated
    };
    client.startDiscovery(discoveryOptions).on('device-new', (device) => {
        if (device.type === 'IOT.SMARTPLUGSWITCH') {
            log.info('Plug found: ' + device.alias);
            plugs[device.alias] = device;
        }
    });
};
