const Manager = require('../managers/head-manager');
const Constants = require('../constants');
const log = require('../loggers/head-logger')('Keypad');

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

const actions = {};

const getMessageHandler = (device) => (message) => {
  if (message == 'ACTIVE') {
    log.info(`${device.name} active`);
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

const keypad_socket = {
  id: 'motion_socket',
  onConnect: (device, initial_message) => {
    device.name = initial_message; // init message is name
    devices[device.name] = device;
    device.setMessageCallback(getMessageHandler(device));
    device.setCloseCallback(() => {
      delete devices[device.name];
      log.info(`${device.name} closed`);
    });
    log.info(`Connected Motion Sensor: ${device.name}`);
  },
};

const sockets = {
  keypad_socket,
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
