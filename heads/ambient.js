const Manager = require('../managers/head-manager');
const Constants = require('../constants');
const log = require('../loggers/head-logger')('Ambient');

let devices = {};

const events = {};

const getLevel = {
  name: 'getLevel',
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
      name: 'lightLevel',
      type: Constants.TYPES.NUMBER,
    },
  ],
  run: async (triggers, payload, props) => {
    const name = props.name;
    if (name in devices) {
      payload.lightLevel = devices[name].lightLevel;
    } else {
      log.error(`Invalid device name: ${name}`);
    }
  },
  direct_connections: true,
};

const ifOver = {
  name: 'ifOver',
  triggers: ['True', 'False'],
  input: [
    {
      name: 'level',
      type: Constants.TYPES.NUMBER,
      input: Constants.INPUT.RAW,
    },
    {
      name: 'name',
      type: Constants.TYPES.STRING,
      input: Constants.INPUT.RAW,
    },
  ],
  output: [],
  run: (triggers, payload, props) => {
    const { runTrue, runFalse } = triggers;
    const name = props.name;
    const level = props.level;
    if (name in devices && level != null) {
      if (devices[name].lightLevel > level) {
        runTrue();
      } else {
        runFalse();
      }
    } else {
      log.error(`Invalid input for ifOver - name: ${name}, level: ${level}`);
    }
  },
  direct_connections: true,
};

const ifUnder = {
  name: 'ifUnder',
  triggers: ['True', 'False'],
  input: [
    {
      name: 'level',
      type: Constants.TYPES.NUMBER,
      input: Constants.INPUT.RAW,
    },
    {
      name: 'name',
      type: Constants.TYPES.STRING,
      input: Constants.INPUT.RAW,
    },
  ],
  output: [],
  run: (triggers, payload, props) => {
    const { runTrue, runFalse } = triggers;
    const name = props.name;
    const level = props.level;
    if (name in devices && level != null) {
      if (devices[name].lightLevel < level) {
        runTrue();
      } else {
        runFalse();
      }
    } else {
      log.error(`Invalid input for ifOver - name: ${name}, level: ${level}`);
    }
  },
  direct_connections: true,
};

const actions = {
  getLevel,
  ifOver,
  ifUnder,
};

const getMessageHandler = (device) => (message) => {
  const num = parseFloat(message);
  if (num != NaN) {
    device.lightLevel = num;
    log.debug(`Light level for ${device.name}: ${num}`);
  } else {
    log.error(`Invalid light level message: ${message}`);
  }
};

const ambient_socket = {
  id: 'ambient_socket',
  onConnect: (device, initial_message) => {
    device.name = initial_message; // init message is name
    device.lightLevel = 0;
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
  keypad_socket: ambient_socket,
};

const head = {
  name: 'Ambient',
  events,
  actions,
  sockets,
};

module.exports.initialize = () => {
  Manager.register(head);
};
