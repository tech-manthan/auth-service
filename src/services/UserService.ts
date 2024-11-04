import { Repository } from "typeorm";
import { UserServiceConstructor } from "../types/service.type";
import { UserData } from "../types/user.type";
import { User } from "../entity";
import createHttpError from "http-errors";

export default class UserService {
  private userRepository: Repository<User>;

  constructor({ userRepository }: UserServiceConstructor) {
    this.userRepository = userRepository;
  }

  async create({ firstName, lastName, email, password }: UserData) {
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
      });
    } catch {
      throw createHttpError(500, "database error while saving user");
    }
  }
}
