const { Transport } = require('winston');
const db = require('../../db');

class MongoTransport extends Transport {
  constructor(opts) {
    super(opts);
    // Initialize any necessary properties for your transport
  }

  log(info, callback) {
    setImmediate(() => {
      const formattedMessage = this.format.transform(info, this.format.options);
      const message = formattedMessage[Symbol.for('message')];
      const parsed = JSON.parse(message);
      if (parsed.timestamp) {
        parsed.timestamp = new Date(parsed.timestamp); // convert timestamp into Date object to be stored correctly
      }
      db.addLog(parsed);
    });

    callback();
  }
}

module.exports = { MongoTransport };
