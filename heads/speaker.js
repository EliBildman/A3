const Manager = require('../managers/head-manager');
const Constants = require('../constants');
const log = require('../logging/loggers/head-logger')('Speaker');
const Stats = require('../managers/stats-manager');

let devices = {};

const events = {};

const say = {
  name: 'say',
  triggers: [],
  input: [
    {
      name: 'name',
      type: Constants.TYPES.STRING,
      input: Constants.INPUT.RAW,
    },
    {
      name: 'words',
      type: Constants.TYPES.ANY,
      input: Constants.INPUT.EITHER,
    },
  ],
  output: [],
  run: (triggers, payload, props) => {
    const speaker = devices[props.name];
    if (speaker) {
      let words = Manager.getValue(props.words, payload);
      if (typeof words !== 'string') {
        words = JSON.stringify(words);
      }
      speaker.send(words);
    } else {
      log.error(`Speaker ${props.name} not found`);
    }
  },
  direct_connections: true,
};

const actions = { say };

const getMessageHandler = (device) => (message) => {};

const speaker_socket = {
  id: 'speaker_socket',
  onConnect: (device, initial_message) => {
    device.name = initial_message; // init message is name
    devices[device.name] = device;
    device.setMessageCallback(getMessageHandler(device));
    device.setCloseCallback(() => {
      delete devices[device.name];
      log.info(`${device.name} closed`);
    });
    log.info(`Connected Speaker: ${device.name}`);
  },
};

const sockets = {
  speaker_socket,
};

const head = {
  name: 'Speaker',
  events,
  actions,
  sockets,
};

module.exports.initialize = () => {
  Manager.register(head);

  Stats.onLog((stats) => {
    const num_speakers = Object.keys(devices).length;
    if (!stats.num_devices) stats.num_devices = 0;
    stats.num_devices += num_speakers;
    stats.num_speakers = num_speakers;
  });
};
