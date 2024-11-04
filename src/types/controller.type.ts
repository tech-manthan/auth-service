import { Logger } from "winston";
import { PasswordService, TokenService, UserService } from "../services";

export interface AuthControllerConstructor {
  userService: UserService;
  passwordService: PasswordService;
  tokenService: TokenService;
  logger: Logger;
}
