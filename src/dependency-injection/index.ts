import {
  AuthController,
  TenantController,
  UserController,
} from "../controllers";
import { AppDataSource } from "../database/data-source";
import { RefreshToken, Tenant, User } from "../entity";
import {
  PasswordService,
  TenantService,
  TokenService,
  UserService,
} from "../services";

import { logger } from "../utils";

const userRepository = AppDataSource.getRepository(User);
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tenantRepository = AppDataSource.getRepository(Tenant);

const userService = new UserService({ userRepository });
const passwordService = new PasswordService();
const tokenService = new TokenService({ refreshTokenRepository });
const tenantService = new TenantService({ tenantRepository });

const authController = new AuthController({
  userService,
  passwordService,
  tokenService,
  logger,
});
const tenantController = new TenantController({
  tenantService,
  logger,
});
const userController = new UserController({
  userService,
  passwordService,
  logger,
});

export { authController, tenantController, userController };
