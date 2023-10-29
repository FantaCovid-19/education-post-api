import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logDir = join(process.cwd(), 'logs');

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const logFormat = winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: join(logDir, 'debug'),
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: join(logDir, 'error'),
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true
    })
  ]
});

logger.add(new winston.transports.Console({ format: winston.format.combine(winston.format.splat(), winston.format.colorize()), silent: process.env.NODE_ENV === 'testing' }));

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  }
};

export { logger, stream };
