const { createLogger, format, transports } = require('winston');
const { SocketTransport } = require('../transports/socket-transport');
const { MongoTransport } = require('../transports/mongo-transport');

module.exports = createLogger({
  level: process.env.LOG_LEVEL,
  defaultMeta: { category: 'SYSTEM' },
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL,
      format: format.combine(
        format.timestamp({
          format: 'HH:mm:ss',
        }),
        format.colorize(),
        format.printf(
          (log) => `${log.timestamp} [${log.category}] ${log.message}`
        )
      ),
    }),
    new SocketTransport({
      level: process.env.LOG_LEVEL,
      format: format.combine(
        format.timestamp({
          format: 'HH:mm:ss',
        }),
        format.printf(
          (log) => `${log.timestamp} [${log.category}] ${log.message}`
        )
      ),
    }),
    new MongoTransport({
      level: 'silly',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});
