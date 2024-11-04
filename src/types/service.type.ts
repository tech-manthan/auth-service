import { Repository } from "typeorm";
import { User } from "../entity";

export interface UserServiceConstructor {
  userRepository: Repository<User>;
}
