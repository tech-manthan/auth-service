import express, { Request, Response } from "express";
import { AuthController } from "../controllers";
import { UserService } from "../services";
import { AppDataSource } from "../database/data-source";
import { User } from "../entity";

const authRouter = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService({ userRepository });
const authController = new AuthController({ userService });

authRouter.post("/register", (req: Request, res: Response) =>
  authController.register(req, res),
);

export default authRouter;
