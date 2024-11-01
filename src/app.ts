import "reflect-metadata";

import express, { Request, Response } from "express";
import { globalErrorMiddleware } from "./middlewares";
import { authRouter } from "./routes";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Auth Service");
});

app.use("/auth", authRouter);

app.use(globalErrorMiddleware);

export default app;
