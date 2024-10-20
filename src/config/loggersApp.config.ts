const winston = require("winston");

const logLevels = {
    levels: {
        emerg: 0,
        alert: 1,
        crit: 2,
        error: 3,
        warning: 4,
        notice: 5,
        info: 6,
        debug: 7,
    },
};

const colorsLogger = {
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "orange",
};

// format json console
const prettyJson = winston.format.printf((info: any) => {
    if (info.message.constructor === Object) {
        info.message = JSON.stringify(info.message, null, 4);
    }
    return `[${process.env.APP_NAME}] [${info.timestamp}] [${info.level}] ${info.message}`;
});

const transportsList = [];

winston.addColors(colorsLogger);
transportsList.push(
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            prettyJson
        ),
        handleExceptions: true,
        prettyPrint: true,
    }),
    // File log
    new winston.transports.File({
        name: "info-file",
        filename: "filelog-info.log",
        handleExceptions: false,
        maxsize: 5242880, //5MB
        maxFiles: 8,
        level: "info",
    })
);

// Logger
export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(
            (info: any) =>
                `[${process.env.APP_NAME}] [${
                    info.timestamp
                }] [${info.level.toUpperCase()}] ${JSON.stringify(
                    info.message
                )}`
        )
    ),
    level: "info",
    transports: transportsList,
});
