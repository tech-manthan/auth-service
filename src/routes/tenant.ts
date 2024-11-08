import express, { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Tenant } from "../entity";
import { TenantService } from "../services";
import { TenantController } from "../controllers";
import { logger } from "../utils";

const tenantRouter = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenant);

const tenantService = new TenantService({ tenantRepository });

const tenantController = new TenantController({
  tenantService,
  logger,
});

tenantRouter.post("/", (req: Request, res: Response, next: NextFunction) =>
  tenantController.create(req, res, next),
);

export default tenantRouter;
