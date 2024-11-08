import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { AppDataSource } from "../database/data-source";
import { Tenant } from "../entity";
import { TenantService } from "../services";
import { TenantController } from "../controllers";
import { logger } from "../utils";
import { authenticate, canAccess } from "../middlewares";
import { Roles } from "../constants";
import {
  createTenantValidator,
  idParamValidator,
  updateTenantValidator,
} from "../validators";
import {
  CreateTenantRequest,
  IdParamRequest,
  UpdateTenantRequest,
} from "../types/request.type";

const tenantRouter = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService({ tenantRepository });

const tenantController = new TenantController({
  tenantService,
  logger,
});

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

tenantRouter.delete(
  "/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  idParamValidator,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.delete(req as IdParamRequest, res, next),
);

tenantRouter.put(
  "/:id",
  authenticate as RequestHandler,
  canAccess([Roles.ADMIN]) as RequestHandler,
  idParamValidator,
  updateTenantValidator,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.update(req as UpdateTenantRequest, res, next),
);

export default tenantRouter;
