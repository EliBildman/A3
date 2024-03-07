const { Transport } = require('winston');
const socket_manager = require('../../managers/socket-manager');

class SocketTransport extends Transport {
  constructor(opts) {
    super(opts);
    // Initialize any necessary properties for your transport
  }

  log(info, callback) {
    setImmediate(() => {
      const formattedMessage = this.format.transform(info, this.format.options);
      const message = formattedMessage[Symbol.for('message')];
      socket_manager.sendLog(message);
    });

    callback();
  }
}

module.exports = { SocketTransport };
