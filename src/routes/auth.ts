import express, { Request, Response } from "express";
import { AuthController } from "../controllers";

const authRouter = express.Router();

const authController = new AuthController();

authRouter.post("/register", (req: Request, res: Response) =>
  authController.register(req, res),
);

export default authRouter;
