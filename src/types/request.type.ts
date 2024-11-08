import { Request } from "express";
import {
  CreateUserData,
  LoginUserData,
  RegisterUserData,
  UpdateUserData,
} from "./user.type";
import { CreateTenantData, UpdateTenantData } from "./tenant.type";

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

export interface IdParamRequest extends Request {
  params: {
    id: string;
  };
}

export interface UpdateTenantRequest extends IdParamRequest {
  body: UpdateTenantData;
}

export interface CreateUserRequest extends Request {
  body: CreateUserData;
}

export interface UpdateUserRequest extends IdParamRequest {
  body: UpdateUserData;
}
