import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { logger } from "../utils";

const globalErrorMiddleware = (
  err: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  logger.error(err.message);

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message || "Internal Server Error",
        path: "",
        location: "",
      },
    ],
  });
};

export default globalErrorMiddleware;
