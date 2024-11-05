import { Request } from "express";
import { LoginUserData, RegisterUserData } from "./user.type";

export interface RegisterUserRequest extends Request {
  body: RegisterUserData;
}

export interface LoginUserRequest extends Request {
  body: LoginUserData;
}

export type AuthCookie = {
  accessToken: string;
  refreshToken: string;
};

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    id: string | number;
    role: string;
    email: string;
  };
}
