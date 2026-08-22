const winston = require('winston');

/**
 * Application logger.
 *
 * Exposes the standard winston levels used across the app:
 *   logger.info(...)  logger.warn(...)  logger.error(...)
 *
 * Logs are printed to the console and persisted to combined/error log files.
 */
// Silence log output while running the test suite to keep test output readable.
const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

const logger = winston.createLogger({
    level: 'info',
    silent: isTest,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
            (info) => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

module.exports = logger;
