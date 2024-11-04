import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers";
import { PasswordService, UserService } from "../services";
import { AppDataSource } from "../database/data-source";
import { User } from "../entity";
import { logger } from "../utils";
import { registerUserValidator } from "../validators";
import { RegisterUserRequest } from "../types/request.type";

const authRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);

const userService = new UserService({ userRepository });
const passwordService = new PasswordService();
const authController = new AuthController({
  userService,
  passwordService,
  logger,
});

authRouter.post(
  "/register",
  registerUserValidator,
  (req: Request, res: Response, next: NextFunction) => {
    void authController.register(req as RegisterUserRequest, res, next);
  },
);

export default authRouter;
