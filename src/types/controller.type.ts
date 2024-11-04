import { Logger } from "winston";
import { PasswordService, UserService } from "../services";

export interface AuthControllerConstructor {
  userService: UserService;
  passwordService: PasswordService;
  logger: Logger;
}
