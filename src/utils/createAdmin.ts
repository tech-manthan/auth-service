import { Roles } from "../constants";
import { AppDataSource } from "../database/data-source";
import { User } from "../entity";
import logger from "./logger";

async function createAdmin() {
  const userRepository = AppDataSource.getRepository(User);

  const admin = await userRepository.findOne({
    where: {
      email: "admin@gmail.com",
    },
  });

  if (admin) {
    logger.info("Admin User already exist");
    return;
  }
  await userRepository.save({
    firstName: "Admin",
    lastName: "User",
    email: "admin@gmail.com",
    password: "Admin@123",
    role: Roles.ADMIN,
  });
  logger.info("Admin User created successfully");
}

export default createAdmin;
