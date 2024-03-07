const { createLogger, format, transports } = require('winston');
const { SocketTransport } = require('../transports/socket-transport');
const { MongoTransport } = require('../transports/mongo-transport');

module.exports = (name) => {
  return createLogger({
    level: process.env.LOG_LEVEL,
    defaultMeta: { category: 'MANAGER' },
    transports: [
      new transports.Console({
        level: process.env.LOG_LEVEL,
        format: format.combine(
          format.label({ label: name }),
          format.timestamp({
            format: 'HH:mm:ss',
          }),
          format.printf(
            (log) => `${log.timestamp} [${log.label}] ${log.message}`
          )
        ),
      }),
      new SocketTransport({
        level: process.env.LOG_LEVEL,
        format: format.combine(
          format.label({ label: name }),
          format.timestamp({
            format: 'HH:mm:ss',
          }),
          format.printf(
            (log) => `${log.timestamp} [${log.label}] ${log.message}`
          )
        ),
      }),
      new MongoTransport({
        level: 'silly', // perma silly, get everything
        format: format.combine(
          format.label({ label: name, message: false }),
          format.timestamp(),
          format.json()
        ),
      }),
    ],
  });
};
