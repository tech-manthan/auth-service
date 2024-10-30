import winston from "winston";
import CONFIG from "../config";

const logger = winston.createLogger({
  level: "info",
  defaultMeta: {
    serviceName: "service-template",
  },

  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      silent: CONFIG.NODE_ENV === "production" || CONFIG.NODE_ENV === "test",
    }),
    new winston.transports.File({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      dirname: "logs",
      filename: "combined.log",
      silent: CONFIG.NODE_ENV === "test",
    }),
    new winston.transports.File({
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      dirname: "logs",
      filename: "error.log",
      silent: CONFIG.NODE_ENV === "test",
    }),
  ],
});

export default logger;
