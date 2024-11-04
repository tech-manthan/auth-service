import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types/request.type";
import { UserService } from "../services";
import { AuthControllerConstructor } from "../types/controller.type";
import { Logger } from "winston";

export class AuthController {
  private userService: UserService;
  private logger: Logger;

  constructor({ userService, logger }: AuthControllerConstructor) {
    this.userService = userService;
    this.logger = logger;
  }

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const { firstName, lastName, email, password } = req.body;
    this.logger.info("request to register a user", {
      email,
      firstName,
      lastName,
    });

    try {
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
      });

      this.logger.info("user registered successfully", {
        id: user.id,
      });
      res.status(201).json({
        id: user.id,
      });
    } catch (err) {
      next(err);
    }
  }
}
