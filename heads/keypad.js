const Manager = require('../managers/head-manager');
const Constants = require('../constants');
const log = require('../logging/loggers/head-logger')('Keypad');
const Stats = require('../managers/stats-manager');

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
    },
    {
      name: 'code',
      type: Constants.TYPES.STRING,
    },
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
      log.info(`${device.name} closed`);
    });
    log.info(`Connected Keypad: ${device.name}`);
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

  Stats.onLog((stats) => {
    const num_keypads = Math.floor(Math.random() * 5); //Object.keys(devices).length;
    if (!stats.num_devices) stats.num_devices = 0;
    stats.num_devices += num_keypads;
    stats.num_keypads = num_keypads;
  });
};
