import winston from 'winston';
import { config } from '../config';

const logLevel = config.logging.logLevel;

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.json(),
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    level: logLevel,
  }),
);

logger.info(`Logger is running with LOG_LEVEL ${logLevel}`);

export { logger };
