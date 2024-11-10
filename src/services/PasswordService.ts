import bcrypt from "bcryptjs";

export default class PasswordService {
  private readonly salt = 10;

  async hashedPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
