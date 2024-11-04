import bcrypt from "bcrypt";

export default class PasswordService {
  private salt = 10;

  constructor() {}

  async hashedPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
