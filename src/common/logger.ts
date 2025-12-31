import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "./config";

const fileTransport = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "10m",
  maxFiles: "14d", //  retention period
});

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    fileTransport,                   // file logging + retention
    new winston.transports.Console() //  console logging
  ],
});

export default logger;
