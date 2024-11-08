import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { authenticate, canAccess } from "../middlewares";
import { Roles } from "../constants";
import {
  createTenantValidator,
  idParamValidator,
  updateUserValidator,
} from "../validators";
import {
  CreateTenantRequest,
  IdParamRequest,
  UpdateTenantRequest,
} from "../types/request.type";
import { tenantController } from "../dependency-injection";

const tenantRouter = express.Router();

tenantRouter.post(
  "/",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  createTenantValidator,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.create(req as CreateTenantRequest, res, next),
);

tenantRouter.get(
  "/",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.getAll(req, res, next),
);

tenantRouter.get(
  "/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  idParamValidator,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.getOne(req as IdParamRequest, res, next),
);

tenantRouter.delete(
  "/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  idParamValidator,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.delete(req as IdParamRequest, res, next),
);

tenantRouter.patch(
  "/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  idParamValidator,
  updateUserValidator,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.update(req as UpdateTenantRequest, res, next),
);

export default tenantRouter;
