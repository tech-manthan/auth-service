import "reflect-metadata";

import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { globalErrorMiddleware } from "./middlewares";
import { authRouter, tenantRouter } from "./routes";

const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to Auth Service");
});

app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);

app.use(globalErrorMiddleware);

export default app;
