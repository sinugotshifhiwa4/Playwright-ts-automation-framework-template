import winston from "winston";
import path from "path";
import moment from "moment-timezone";
import DailyRotateFile from "winston-daily-rotate-file";
import fs from "fs";
import { threadId } from "worker_threads"; // Import threadId if using worker threads

// Ensure the 'logs' directory exists
const currentDir = process.cwd();
const loggingDir = path.join(currentDir, "logs");

if (!fs.existsSync(loggingDir)) {
  fs.mkdirSync(loggingDir);
}

// Custom format for logging, now including PID and threadId (if available)
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const threadInfo = threadId ? ` [Thread: ${threadId}]` : ''; // Optional threadId
  return `${timestamp} [PID: ${process.pid}]${threadInfo} [${level}]: ${message}`;
});

// Set up the logger
const timeZone = 'Africa/Johannesburg';
const logLevel = 'info';            
const logLevelError = 'error'; 

// Create the logger
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => moment().tz(timeZone).format("YYYY-MM-DD HH:mm:ss Z"),
    }),
    customFormat
  ),
  transports: [
    // Console transport with colorized output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      ),
      level: logLevel,
    }),
    // General log file rotation (info, warn, etc.)
    new DailyRotateFile({
      filename: path.join(loggingDir, "test_run-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "1d",
      maxSize: "10m",
      zippedArchive: true,
      level: logLevel,  // Handles only logs below 'error' level
    }),
    // Error log file rotation (only error and above)
    new DailyRotateFile({
      filename: path.join(loggingDir, "test_error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "1d",
      maxSize: "10m",
      zippedArchive: true,
      level: logLevelError,  // Only handle 'error' and above
      handleExceptions: true, // Capture uncaught exceptions
    }),
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(loggingDir, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      maxSize: "10m",
      zippedArchive: true,
    })
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(loggingDir, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      maxSize: "10m",
      zippedArchive: true,
    })
  ],
  exitOnError: false, // Do not exit on handled exceptions
});

export default logger;
