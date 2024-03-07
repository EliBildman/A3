const SocketManager = require('../managers/tcp-manager');
const log = require('../logging/loggers/system-logger');

const DELIM = '\n';

// REGISTRATON HANDSHAKE:
// server: 'CONNECTION_CONFIRM'
// client: '<socket-id>'
// server: 'SOCKET_ID_CONFIRM' | 'ERROR'
// client: '<hb_interval>'
// server: 'HB_CONFIRM' | 'ERROR'
// client: [initial message sent to head]
// -- socket is given to head --

// this file sucks

const routes = SocketManager.getRoutes();

const write = (socket, message) => {
  socket.write(message + DELIM);
};

const createDevice = (socket, hb_int) => {
  log.info(`Created Device ${socket.remoteAddress}:${socket.remotePort}`);
  log.debug(`Heartbeat Interval for ${socket.remoteAddress}: ${hb_int}`);

  let message_callback = (_) => {
    log.warning(`Unset Message Callback Was Run`);
  };

  let close_callback = () => {
    log.warning(`Unset Close Callback Was Run`);
  };

  let heartbeatTimeout = null;

  const setHeartbeatTimeout = () => {
    clearTimeout(heartbeatTimeout);
    heartbeatTimeout = setTimeout(() => {
      log.verbose('Heartbeat Timeout');
      socket.destroy();
    }, hb_int * process.env.HB_TIMEOUT_FACTOR);
  };

  setHeartbeatTimeout();

  return {
    setMessageCallback: (callback) => {
      message_callback = callback;
    },
    onMessage: (message) => {
      if (message === 'HEARTBEAT') {
        log.debug(
          `Heartbeat Recieved From ${socket.remoteAddress}:${socket.remotePort}`
        );
        setHeartbeatTimeout();
        return;
      }
      message_callback(message);
    },
    close: () => {
      socket.destroy();
      this.onClose();
    },
    setCloseCallback: (callback) => {
      close_callback = callback;
    },
    onClose: () => {
      log.verbose(`Device Closed ${socket.remoteAddress}:${socket.remotePort}`);
      close_callback();
    },
    send: (message) => {
      write(socket, message);
    },
  };
};

const onConnection = (socket) => {
  log.verbose(
    `Recieved Connection ${socket.remoteAddress}:${socket.remotePort}`
  );

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
    if (device) device.onClose();
  });
};

module.exports = {
  onConnection,
};
