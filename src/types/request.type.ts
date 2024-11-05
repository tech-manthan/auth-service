import { Request } from "express";
import { LoginUserData, UserData } from "./user.type";

export interface RegisterUserRequest extends Request {
  body: UserData;
}

export interface LoginUserRequest extends Request {
  body: LoginUserData;
}
