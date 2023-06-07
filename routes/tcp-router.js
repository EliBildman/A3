const SocketManager = require('../managers/tcp-manager');
const log = require('../loggers/system-logger');

const DELIM = '\n';

// REGISTRATON HANDSHAKE:
// server: 'CONNECTION_CONFIRM'
// clinet: '<socket-id>'
// server: 'SOCKET_ID_CONFIRM' | 'ERROR'
// client: '<hb_interval>'
// server: 'HB_CONFIRM' | 'ERROR'
// client: [initial message sent to head]
// -- socket is given to head --

// ^ this is a dope way to do it i dont hear the haters

const routes = SocketManager.getRoutes();

const write = (socket, message) => {
  socket.write(message + DELIM);
};

// i can use OOP if i want to eat me
const createDevice = (socket, hb_int) => {
  let message_callback = (_) => {
    log.info('unset message callback');
  };

  let close_callback = () => {};

  let heartbeatTimeout = null;

  const setHeartbeatTimeout = () => {
    clearTimeout(heartbeatTimeout);
    heartbeatTimeout = setTimeout(() => {
      log.info('Heartbeat timeout');
      socket.destroy();
    }, hb_int * 2);
  };

  setHeartbeatTimeout();

  return {
    setMessageCallback: (callback) => {
      message_callback = callback;
    },
    onMessage: (message) => {
      if (message === 'HEARTBEAT') {
        // log.info('Heartbeat renew');
        setHeartbeatTimeout();
        return;
      }
      message_callback(message);
    },
    close: () => {
      socket.destroy();
      close_callback();
    },
    setCloseCallback: (callback) => {
      close_callback = callback;
    },
    onClose: () => {
      close_callback();
    },
    send: (message) => {
      write(socket, message);
    },
  };
};

const onConnection = (socket) => {
  log.info(`connection from ${socket.remoteAddress}:${socket.remotePort}`);

  let route = null;
  let hb_int = null;
  let device = null;

  write(socket, 'CONNECTION_CONFIRM');

  let buffer = '';

  const handleIncomingMessage = (message) => {
    if (!route) {
      if (message in routes) {
        route = routes[message];
        write(socket, 'SOCKET_ID_CONFIRM');
      } else {
        write(socket, `ERROR ${message}`);
      }
      return;
    }

    if (!hb_int) {
      const num = parseInt(message);
      if (!isNaN(num)) {
        hb_int = num;
        write(socket, 'HB_CONFIRM');
      } else {
        write(socket, `ERROR ${message}`);
      }
      return;
    }

    if (!device) {
      device = createDevice(socket, hb_int);
      route.onConnect(device, message);
      return;
    }

    device.onMessage(message);
  };

  socket.on('data', (data) => {
    buffer += data.toString('utf-8');

    let ind;
    while ((ind = buffer.indexOf(DELIM)) != -1) {
      const message = buffer.substring(0, ind);
      buffer = buffer.substring(ind + 1);
      handleIncomingMessage(message);
    }
  });

  socket.on('close', () => {
    device.onClose();
  });
};

module.exports = {
  onConnection,
};
