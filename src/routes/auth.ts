import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { loginUserValidator, registerUserValidator } from "../validators";
import {
  authenticate,
  parseRefreshToken,
  validateRefreshToken,
} from "../middlewares";
import { AuthRequest } from "../types/request.type";
import { authController } from "../dependency-injection";

const authRouter = express.Router();

authRouter.post(
  "/register",
  registerUserValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

authRouter.post(
  "/login",
  loginUserValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

authRouter.get(
  "/self",
  authenticate as RequestHandler,
  (req: Request, res: Response, next: NextFunction) =>
    authController.self(req as AuthRequest, res, next),
);

authRouter.post(
  "/refresh",
  validateRefreshToken as RequestHandler,
  (req: Request, res: Response, next: NextFunction) =>
    authController.refresh(req as AuthRequest, res, next),
);

authRouter.post(
  "/logout",
  authenticate as RequestHandler,
  parseRefreshToken as RequestHandler,
  (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req as AuthRequest, res, next),
);

export default authRouter;
