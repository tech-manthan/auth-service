import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types/request.type";
import { PasswordService, UserService } from "../services";
import { AuthControllerConstructor } from "../types/controller.type";
import { Logger } from "winston";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";

export class AuthController {
  private userService: UserService;
  private passwordService: PasswordService;
  private logger: Logger;

  constructor({
    userService,
    passwordService,
    logger,
  }: AuthControllerConstructor) {
    this.userService = userService;
    this.passwordService = passwordService;
    this.logger = logger;
  }

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(400).json({
        errors: result.array(),
      });
      return;
    }

    const { firstName, lastName, email, password } = req.body;
    this.logger.info("request to register a user", {
      email,
      firstName,
      lastName,
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
