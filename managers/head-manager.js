const EventManager = require('./event-manager');
const ActionManager = require('./action-manager');
const SocketManager = require('./tcp-manager');
const { LOOKUP_FLAG } = require('../constants');
const log = require('../logging/loggers/manager-logger')('HeadManager');

const heads = [];

module.exports.register = (head) => {
  log.verbose(`Register Head ${head.name}`);
  Object.values(head.events).forEach((event) => {
    EventManager.register(head.name, event);
  });
  Object.values(head.actions).forEach((action) => {
    ActionManager.register(head.name, action);
  });
  Object.values(head.sockets).forEach((socket) => {
    SocketManager.register(socket);
  });
};

// gets value if its a payload val, can also send in natives
// payload values look like: !field_name
// (raw: any) => any
module.exports.getValue = (raw, payload) => {
  if (typeof raw !== 'string' || raw.charAt(0) !== LOOKUP_FLAG) return raw;

  // is a payload value
  const name = raw.substring(1);
  if (!(name in payload)) {
    log.error(`Payload value doesn't exist ${name}`);
    return null;
  }

  return payload[name];
};

// for variable inputs, rip off lookup flag
module.exports.getField = (raw) => {
  if (raw.charAt(0) === LOOKUP_FLAG) {
    return raw.substring(1);
  }
  return raw;
};
