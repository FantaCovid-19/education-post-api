import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { NODE_ENV } from '../configs';

const logsSaveDir = join(process.cwd(), 'logs');

if (!existsSync(logsSaveDir)) {
  mkdirSync(logsSaveDir);
}

class LoggerUtils {
  private logger: any;

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
      ),
      transports: [
        new DailyRotateFile({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: join(logsSaveDir, 'debug'),
          filename: `%DATE%.log`,
          maxFiles: 30,
          json: false,
          zippedArchive: true
        }),
        new DailyRotateFile({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: join(logsSaveDir, 'error'),
          filename: `%DATE%.error.log`,
          maxFiles: 30,
          handleExceptions: true,
          json: false,
          zippedArchive: true
        }),
        new transports.Console({ format: format.combine(format.splat(), format.colorize()), silent: NODE_ENV === 'testing' })
      ]
    });
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public stream() {
    return {
      write: (message: string) => {
        this.logger.info(message.substring(0, message.lastIndexOf('\n')));
      }
    };
  }
}

const loggerUtils = new LoggerUtils();

export { loggerUtils };
