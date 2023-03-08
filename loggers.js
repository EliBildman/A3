const { createLogger, format, transports } = require('winston');

const SystemLogger = createLogger({
    level: process.env.LOG_LEVEL,
    defaultMeta: { category: 'head' },
    transports: [
        new transports.File({
            format: format.combine(
                format.label({ label: 'SYSTEM' }),
                format.timestamp({ format: 'MM:DD:YYYY HH:mm:ss' }),
                format.json()
            ),
            filename: `./${process.env.LOG_FILE}`,
        }),
        new transports.Console({
            format: format.combine(
                format.label({ label: 'SYSTEM' }),
                format.timestamp({
                    format: 'HH:MM:SS',
                }),
                format.colorize(),
                format.printf(
                    (log) => `${log.timestamp} [${log.label}] ${log.message}`
                )
            ),
        }),
    ],
});

//exports catagories of loggers as functions that produce given logger
const HeadLogger = (name) => {
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
                        format: 'HH:mm:SS',
                    }),
                    format.printf(
                        (log) =>
                            `${log.timestamp} [${log.label}] ${log.message}`
                    )
                ),
            }),
        ],
    });
};

const ManagerLogger = (name) => {
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
                        format: 'HH:MM:SS',
                    }),
                    format.printf(
                        (log) =>
                            `${log.timestamp} [${log.label}] ${log.message}`
                    )
                ),
            }),
        ],
    });
};

module.exports = {
    SystemLogger,
    HeadLogger,
    ManagerLogger,
};
