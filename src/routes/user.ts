import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { authenticate, canAccess } from "../middlewares";
import { Roles } from "../constants";
import {
  createUserValidator,
  idParamValidator,
  updateUserValidator,
} from "../validators";
import {
  CreateUserRequest,
  IdParamRequest,
  UpdateUserRequest,
} from "../types/request.type";
import { userController } from "../dependency-injection";
import { AuthRequest } from "../types/request.type";

const userRouter = express.Router();

userRouter.post(
  "/",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  createUserValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.create(req as CreateUserRequest, res, next),
);

userRouter.get(
  "/",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getAll(req as AuthRequest, res, next),
);

userRouter.get(
  "/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  idParamValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getOne(req as IdParamRequest, res, next),
);

userRouter.delete(
  "/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  idParamValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.delete(req as IdParamRequest, res, next),
);

userRouter.patch(
  "/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  idParamValidator,
  updateUserValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.update(req as UpdateUserRequest, res, next),
);

export default userRouter;
