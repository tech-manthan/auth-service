import { Repository } from "typeorm";
import { RefreshToken, User } from "../entity";

export interface UserServiceConstructor {
  userRepository: Repository<User>;
}

export interface TokenServiceConstructor {
  refreshTokenRepository: Repository<RefreshToken>;
}
