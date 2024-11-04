import { Repository } from "typeorm";
import { AppDataSource } from "../database/data-source";
import { UserServiceConstructor } from "../types/service.type";
import { UserData } from "../types/user.type";
import { User } from "../entity";

export default class UserService {
  private userRepository: Repository<User>;

  constructor({ userRepository }: UserServiceConstructor) {
    this.userRepository = userRepository;
  }

  async create({ firstName, lastName, email, password }: UserData) {
    const userRepository = AppDataSource.getRepository(User);

    await userRepository.save({
      firstName,
      lastName,
      email,
      password,
    });
  }
}
