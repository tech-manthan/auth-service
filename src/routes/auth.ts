import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers";
import { PasswordService, UserService } from "../services";
import { AppDataSource } from "../database/data-source";
import { User } from "../entity";
import { logger } from "../utils";

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
  (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
);

export default authRouter;
