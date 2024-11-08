import { Not, Repository } from "typeorm";
import { UserServiceConstructor } from "../types/service.type";
import { CreateUserData, UpdateUserData } from "../types/user.type";
import { User } from "../entity";
import createHttpError from "http-errors";

export default class UserService {
  private userRepository: Repository<User>;

  constructor({ userRepository }: UserServiceConstructor) {
    this.userRepository = userRepository;
  }

  async create({
    firstName,
    lastName,
    email,
    password,
    role,
    tenantId,
  }: CreateUserData) {
    try {
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
        role,
        tenant: {
          id: tenantId,
        },
      });
    } catch (err) {
      console.log(err);
      throw createHttpError(500, "database error while saving user");
    }
  }

  async findUserByEmail(email: string) {
    try {
      return await this.userRepository
        .createQueryBuilder("users")
        .where("users.email = :email", {
          email: email,
        })
        .addSelect("users.password")
        .getOne();
    } catch {
      throw createHttpError(500, "database error while fetching user");
    }
  }

  async findUserById(id: number) {
    try {
      return await this.userRepository.findOne({
        where: {
          id,
        },
      });
    } catch {
      throw createHttpError(500, "database error while fetching user");
    }
  }

  async getAll(excludedId: number) {
    try {
      return await this.userRepository.find({
        relations: ["tenant"],
        where: {
          id: Not(excludedId),
        },
      });
    } catch {
      throw createHttpError(500, "database error while fetching users");
    }
  }

  async getOne(id: number) {
    try {
      return await this.userRepository.findOne({
        relations: ["tenant"],
        where: {
          id: id,
        },
      });
    } catch {
      throw createHttpError(500, "database error while fetching user");
    }
  }

  async delete(id: number) {
    try {
      return await this.userRepository.delete(id);
    } catch {
      throw createHttpError(500, "database error while deleting user");
    }
  }

  async update(
    id: number,
    { firstName, lastName, role, tenantId }: UpdateUserData,
  ) {
    try {
      return await this.userRepository.update(id, {
        firstName,
        lastName,
        role,
        tenant: {
          id: tenantId,
        },
      });
    } catch (err) {
      console.log(err);
      throw createHttpError(500, "database error while updating user");
    }
  }
}
