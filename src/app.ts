import express, { Request, Response } from "express";
import { globalErrorMiddleware } from "./middlewares";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Service Template");
});

app.use(globalErrorMiddleware);

export default app;
