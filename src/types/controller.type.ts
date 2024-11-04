import { UserService } from "../services";

export interface AuthControllerConstructor {
  userService: UserService;
}
