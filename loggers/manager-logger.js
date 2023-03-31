const { createLogger, format, transports } = require('winston');
const { SocketTransport } = require('./socket-transport');

module.exports = (name) => {
  return createLogger({
    level: process.env.LOG_LEVEL,
    defaultMeta: { category: 'head' },
    transports: [
      new transports.File({
        format: format.combine(
          format.label({ label: name, message: false }),
          format.timestamp({ format: 'MM:DD:YYYY HH:mm:ss' }),
          format.json()
        ),
        filename: `./${process.env.LOG_FILE}`,
      }),
      new transports.Console({
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
    ],
  });
};
