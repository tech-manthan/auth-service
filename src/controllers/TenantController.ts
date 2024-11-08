import { NextFunction, Response } from "express";
import { CreateTenantRequest } from "../types/request.type";
import { TenantService } from "../services";
import { TenantControllerConstructor } from "../types/controller.type";
import { Logger } from "winston";
import { validationResult } from "express-validator";

export class TenantController {
  private tenantService: TenantService;
  private logger: Logger;

  constructor({ tenantService, logger }: TenantControllerConstructor) {
    this.tenantService = tenantService;
    this.logger = logger;
  }

  async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({
        errors: result.array(),
      });
      return;
    }

    const { name, address } = req.body;
    this.logger.info("request to create a tenant", {
      name,
      address,
    });

    try {
      const tenant = await this.tenantService.create({
        name,
        address,
      });

      this.logger.info("tenant created successfully", {
        id: tenant.id,
      });

      res.status(201).json({
        id: tenant.id,
      });
    } catch (err) {
      next(err);
    }
  }
}
