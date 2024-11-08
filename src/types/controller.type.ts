import { Logger } from "winston";
import {
  PasswordService,
  TenantService,
  TokenService,
  UserService,
} from "../services";

export interface AuthControllerConstructor {
  userService: UserService;
  passwordService: PasswordService;
  tokenService: TokenService;
  logger: Logger;
}

export interface TenantControllerConstructor {
  tenantService: TenantService;
  logger: Logger;
}
