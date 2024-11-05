import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers";
import { PasswordService, TokenService, UserService } from "../services";
import { AppDataSource } from "../database/data-source";
import { RefreshToken, User } from "../entity";
import { logger } from "../utils";
import { loginUserValidator, registerUserValidator } from "../validators";

const authRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);

const userService = new UserService({ userRepository });
const passwordService = new PasswordService();
const tokenService = new TokenService({ refreshTokenRepository });
const authController = new AuthController({
  userService,
  passwordService,
  tokenService,
  logger,
});

authRouter.post(
  "/register",
  registerUserValidator,
  (req: Request, res: Response, next: NextFunction) => {
    void authController.register(req, res, next);
  },
);

authRouter.post(
  "/login",
  loginUserValidator,
  (req: Request, res: Response, next: NextFunction) => {
    void authController.login(req, res, next);
  },
);

export default authRouter;
