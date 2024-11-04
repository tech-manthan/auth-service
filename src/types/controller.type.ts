import { Logger } from "winston";
import { UserService } from "../services";

export interface AuthControllerConstructor {
  userService: UserService;
  logger: Logger;
}
