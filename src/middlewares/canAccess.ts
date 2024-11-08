import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/request.type";
import createHttpError from "http-errors";

function canAccess(roles: Array<string> = []) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.auth.role;

    if (!roles.includes(role)) {
      next(createHttpError(403, "not authroized to access this service"));
      return;
    }

    next();
  };
}

export default canAccess;
