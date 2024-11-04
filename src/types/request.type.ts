import { Request } from "express";
import { UserData } from "./user.type";

export interface RegisterUserRequest extends Request {
  body: UserData;
}
