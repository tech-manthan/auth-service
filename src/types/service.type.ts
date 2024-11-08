import { Repository } from "typeorm";
import { RefreshToken, Tenant, User } from "../entity";

export interface UserServiceConstructor {
  userRepository: Repository<User>;
}

export interface TokenServiceConstructor {
  refreshTokenRepository: Repository<RefreshToken>;
}

export interface TenantServiceConstructor {
  tenantRepository: Repository<Tenant>;
}
