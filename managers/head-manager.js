const EventManager = require('./event-manager');
const ActionManager = require('./action-manager');
const SocketManager = require('./socket-manager');

const heads = [];

module.exports.register = (head) => {
    // console.log('init', head.name);
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
    if (typeof raw != 'string' || raw.charAt(0) != '!') return raw;

    // is a payload value
    const name = raw.substring(1);
    if (!(name in payload)) {
        // deal with bad input
    }

    return payload[name];
};
