const Manager = require('../managers/head-manager');
const Constants = require('../constants');
const log = require('../loggers/head-logger')('Motion');

let devices = {};

const onActive = {
  name: 'onActive',
  props: [
    {
      name: 'sensor_name',
      type: Constants.TYPES.STRING,
    },
  ],
  fire: () => {}, // gets set in registration
  output: [
    {
      name: 'sensor_name',
      type: Constants.TYPES.STRING,
    },
  ],
};

const onInactive = {
  name: 'onInactive',
  props: [
    {
      name: 'sensor_name',
      type: Constants.TYPES.STRING,
    },
  ],
  fire: () => {}, // gets set in registration
  output: [
    {
      name: 'sensor_name',
      type: Constants.TYPES.STRING,
    },
  ],
};

const events = {
  onActive,
  onInactive,
};

const getLastActive = {
  name: 'getLastActive',
  triggers: [],
  input: [
    {
      name: 'name',
      type: Constants.TYPES.STRING,
      input: Constants.INPUT.RAW,
    },
  ],
  output: [
    {
      name: 'lastActiveTime',
      type: Constants.TYPES.NUMBER,
    },
  ],
  run: async (triggers, payload, props) => {
    const name = props.name;
    if (name in devices) {
      payload.lastActiveTime = devices[name].lastActive;
    }
  },
  direct_connections: true,
};

const actions = {};

const getMessageHandler = (device) => (message) => {
  if (message == 'ACTIVE') {
    log.info(`${device.name} active`);
    device.lastActive = new Date().getTime();
    onActive.fire(
      (props) => {
        // optional name, can be null
        return !props.sensor_name || props.sensor_name === device.name;
      },
      { sensor_name: device.name }
    );
  }
  if (message == 'INACTIVE') {
    log.info(`${device.name} inactive`);
    onInactive.fire(
      (props) => {
        return !props.sensor_name || props.sensor_name === device.name;
      },
      { sensor_name: device.name }
    );
  }
};

const motion_socket = {
  id: 'motion_socket',
  onConnect: (device, initial_message) => {
    device.name = initial_message; // init message is name
    device.lastActive = new Date().getTime();
    devices[device.name] = device;
    device.setMessageCallback(getMessageHandler(device));
    device.setCloseCallback(() => {
      delete devices[device.name];
      log.info(`${device.name} closed`);
    });
    log.info(`Connected Sensor: ${device.name}`);
  },
};

const sockets = {
  keypad_socket: motion_socket,
};

const head = {
  name: 'Motion',
  events,
  actions,
  sockets,
};

module.exports.initialize = () => {
  Manager.register(head);
};
