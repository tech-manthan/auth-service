import { Request } from "express";
import { LoginUserData, RegisterUserData } from "./user.type";
import { CreateTenantData } from "./tenant.type";

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
    id: string;
    role: string;
    email: string;
  };
}

export interface CreateTenantRequest extends Request {
  body: CreateTenantData;
}
