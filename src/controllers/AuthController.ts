import { Response } from "express";
import { RegisterUserRequest } from "../types/request.type";
import { UserService } from "../services";
import { AuthControllerConstructor } from "../types/controller.type";

export class AuthController {
  private userService: UserService;

  constructor({ userService }: AuthControllerConstructor) {
    this.userService = userService;
  }

  async register(req: RegisterUserRequest, res: Response) {
    const { firstName, lastName, email, password } = req.body;

    const user = await this.userService.create({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      id: user.id,
    });
  }
}
