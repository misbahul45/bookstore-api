import winston from 'winston';
import { randomBytes } from 'crypto';
import path from 'path';
import 'dotenv/config';

// Constants
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

const LOG_COLORS = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue'
};

const timestampFormat = 'YYYY-MM-DD HH:mm:ss';
const appVersion = process.env.APP_VERSION || '1.0.0';
const generateLogId = () => randomBytes(16).toString('hex');

// Custom format untuk console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: timestampFormat }),
  winston.format.colorize({ colors: LOG_COLORS }),
  winston.format.printf(({ timestamp, level, message, ...data }) => {
    return `[${timestamp}] ${level}: ${message} ${Object.keys(data).length ? JSON.stringify(data, null, 2) : ''}`;
  })
);

// Custom format untuk file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: timestampFormat }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...data }) => {
    const response = {
      level,
      logId: generateLogId(),
      timestamp,
      appInfo: {
        appVersion,
        environment: process.env.NODE_ENV,
        processId: process.pid,
      },
      message,
      data,
    };
    return JSON.stringify(response);
  })
);

// Logger untuk HTTP requests
export const httpLogger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: fileFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
    // File transport untuk error
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File transport untuk semua level
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  ]
});

// Logger untuk aplikasi
export const appLogger = winston.createLogger({
  levels: winston.config.npm.levels,
  format: fileFormat,
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
    new winston.transports.File({
      filename: path.join('logs', 'app-error.log'),
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'app-combined.log'),
      maxsize: 5242880,
      maxFiles: 5,
    })
  ]
});

// Menambahkan handler untuk unhandled rejections
process.on('unhandledRejection', (error) => {
  appLogger.error('Unhandled Rejection', { error: error.stack || error });
});

// Menambahkan handler untuk uncaught exceptions
process.on('uncaughtException', (error) => {
  appLogger.error('Uncaught Exception', { error: error.stack || error });
  process.exit(1);
});