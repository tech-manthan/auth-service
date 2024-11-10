import { NextFunction, Response } from "express";
import {
  AuthRequest,
  CreateUserRequest,
  IdParamRequest,
  UpdateUserRequest,
} from "../types/request.type";
import { PasswordService, UserService } from "../services";
import { UserControllerConstructor } from "../types/controller.type";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export class UserController {
  private readonly userService: UserService;
  private readonly passwordService: PasswordService;
  private readonly logger: Logger;

  constructor({
    logger,
    userService,
    passwordService,
  }: UserControllerConstructor) {
    this.userService = userService;
    this.passwordService = passwordService;
    this.logger = logger;
  }

  async create(req: CreateUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      console.log(result.array());
      res.status(400).json({
        errors: result.array(),
      });
      return;
    }

    const { firstName, lastName, email, password, tenantId, role } = req.body;
    this.logger.info("request to create a user", {
      firstName,
      lastName,
      email,
      password,
      tenantId,
    });

    try {
      const userExist = await this.userService.findUserByEmail(email);

      if (userExist) {
        const err = createHttpError(400, "user already exist, try logging in");
        return next(err);
      }

      const hashedPassword =
        await this.passwordService.hashedPassword(password);

      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        tenantId,
      });

      this.logger.info("user created successfully", {
        id: user.id,
      });

      res.status(201).json({
        id: user.id,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.auth.sub;
      this.logger.info("request to list all tenants");

      const users = await this.userService.getAll(Number(userId));

      this.logger.info("users fetched successfully");

      res.status(200).json(users);
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

    const userId = req.params.id;
    try {
      this.logger.info("request to get user", {
        id: userId,
      });

      const user = await this.userService.getOne(Number(userId));

      if (!user) {
        const err = createHttpError(400, "user does not exist");
        next(err);
        return;
      }

      this.logger.info("user fetched successfully", {
        email: user.email,
      });

      res.status(200).json(user);
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

    const userId = req.params.id;
    try {
      this.logger.info("request to delete user", {
        id: userId,
      });

      const deleted = await this.userService.delete(Number(userId));

      if (deleted.affected === 0) {
        const err = createHttpError(400, "user does not exists");
        next(err);
        return;
      }

      this.logger.info("user deleted successfully");

      res.status(200).json({ id: Number(userId) });
    } catch (err) {
      next(err);
    }
  }

  async update(req: UpdateUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({
        errors: result.array(),
      });
      return;
    }

    const userId = req.params.id;
    try {
      const { firstName, lastName, role, tenantId } = req.body;

      if (!firstName && !role && !lastName) {
        const err = createHttpError(400, "no data to update");
        next(err);
        return;
      }

      this.logger.info("request to update user", {
        id: userId,
      });

      const updated = await this.userService.update(Number(userId), {
        firstName,
        lastName,
        role,
        tenantId,
      });

      if (updated.affected === 0) {
        const err = createHttpError(400, "tenant does not exists");
        next(err);
        return;
      }

      this.logger.info("tenant updated successfully");

      res.status(200).json({ id: Number(userId) });
    } catch (err) {
      next(err);
    }
  }
}
