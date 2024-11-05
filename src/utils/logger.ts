import winston from "winston";
import CONFIG from "../config";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: {
    serviceName: "auth-service",
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),

  transports: [
    new winston.transports.Console({
      level: "info",
      silent: CONFIG.NODE_ENV === "production" || CONFIG.NODE_ENV === "test",
    }),
    new winston.transports.File({
      level: "info",

      dirname: "log",
      filename: "combined.log",
      silent: CONFIG.NODE_ENV === "test",
    }),
    new winston.transports.File({
      level: "error",
      dirname: "log",
      filename: "error.log",
      silent: CONFIG.NODE_ENV === "test",
    }),
  ],
});

export default logger;
