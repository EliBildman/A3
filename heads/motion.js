const Manager = require('../managers/head-manager');
const Constants = require('../constants');
const log = require('../logging/loggers/head-logger')('Motion');
const Stats = require('../managers/stats-manager');

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

const inactiveTime = {
  name: 'inactiveTime',
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
      name: 'timeInactive',
      type: Constants.TYPES.NUMBER,
    },
  ],
  run: async (triggers, payload, props) => {
    const name = props.name;
    if (name in devices) {
      const now = new Date().getTime();
      payload.timeInactive = now - devices[name].lastActive;
    } else {
      log.error(`Invalid device name: ${name}`);
    }
  },
  direct_connections: true,
};

const actions = {
  inactiveTime,
};

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

  Stats.onLog((stats) => {
    if (!stats.num_devices) stats.num_devices = 0;
    stats.num_devices += Object.keys(devices).length;
  });
};
