import { NextFunction, Request, Response } from "express";
import {
  CreateTenantRequest,
  IdParamRequest,
  UpdateTenantRequest,
} from "../types/request.type";
import { TenantService } from "../services";
import { TenantControllerConstructor } from "../types/controller.type";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

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

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      this.logger.info("request to list all tenants");

      const tenants = await this.tenantService.getAll();

      this.logger.info("tenants fetched successfully");

      res.status(200).json(tenants);
    } catch (err) {
      next(err);
    }
  }

  async getOne(req: IdParamRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({
        errors: result.array(),
      });
      return;
    }

    const tenantId = req.params.id;
    try {
      this.logger.info("request to get tenant", {
        id: tenantId,
      });

      const tenant = await this.tenantService.getById(Number(tenantId));

      if (!tenant) {
        const err = createHttpError(400, "tenant does not exist");
        next(err);
        return;
      }

      this.logger.info("tenant fetched successfully", {
        name: tenant.name,
        address: tenant.address,
      });

      res.status(200).json(tenant);
    } catch (err) {
      next(err);
    }
  }

  async delete(req: IdParamRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({
        errors: result.array(),
      });
      return;
    }

    const tenantId = req.params.id;
    try {
      this.logger.info("request to delete tenant", {
        id: tenantId,
      });

      const deleted = await this.tenantService.delete(Number(tenantId));

      if (deleted.affected === 0) {
        const err = createHttpError(400, "tenant does not exists");
        next(err);
        return;
      }

      this.logger.info("tenant deleted successfully");

      res.status(200).json({ id: Number(tenantId) });
    } catch (err) {
      next(err);
    }
  }

  async update(req: UpdateTenantRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({
        errors: result.array(),
      });
      return;
    }

    const tenantId = req.params.id;
    try {
      const { name, address } = req.body;

      if (!name && !address) {
        const err = createHttpError(400, "no data to update");
        next(err);
        return;
      }

      this.logger.info("request to delete tenant", {
        id: tenantId,
      });

      const updated = await this.tenantService.update(Number(tenantId), {
        name,
        address,
      });

      if (updated.affected === 0) {
        const err = createHttpError(400, "tenant does not exists");
        next(err);
        return;
      }

      this.logger.info("tenant updated successfully");

      res.status(200).json({ id: Number(tenantId) });
    } catch (err) {
      next(err);
    }
  }
}
