import { DataSource } from "typeorm";
import app from "../../src/app";
import { UserData } from "../../src/types/user.type";
import createJWKSMock from "mock-jwks";
import request from "supertest";
import { AppDataSource } from "../../src/database/data-source";
import { User } from "../../src/entity";
import { Roles } from "../../src/constants";

describe("GET /auth/self", () => {
  let connection: DataSource;
  let jwks: ReturnType<typeof createJWKSMock>;

  beforeAll(async () => {
    jwks = createJWKSMock("http://localhost:5501");
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    jwks.start();
    await connection.dropDatabase();
    await connection.synchronize();
  });

  afterAll(async () => {
    await connection?.destroy();
  });

  afterEach(() => {
    jwks.stop();
  });

  describe("Given all fields", () => {
    it("should return 200 status code", async () => {
      // Arrange
      const accessToken = jwks.token({
        sub: "1",
        role: Roles.CUSTOMER,
      });

      // Add Cookies
      const response = await request(app as any)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();

      // Assert
      expect(response.statusCode).toBe(200);
    });

    it("should return user data", async () => {
      // User in Database
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "manthan@gmail.com",
        password: "Secret@123",
        role: Roles.CUSTOMER,
      };

      const userRepository = connection.getRepository(User);
      const data = await userRepository.save(userData);

      // Generate Tokens
      const accessToken = jwks.token({
        sub: String(data.id),
        role: data.role,
      });

      // Add Cookies
      const response = await request(app as any)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();

      // Assert
      expect(response.body.id as Record<string, string>).toBe(data.id);
    });

    it("should return not return password", async () => {
      // User in Database
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "manthan@gmail.com",
        password: "Secret@123",
        role: Roles.CUSTOMER,
      };

      const userRepository = connection.getRepository(User);
      const data = await userRepository.save(userData);

      // Generate Tokens
      const accessToken = jwks.token({
        sub: String(data.id),
        role: data.role,
      });

      // Add Cookies
      const response = await request(app as any)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send();

      console.log(response.body);
      // Assert
      expect(response.body as Record<string, string>).not.toHaveProperty(
        "password",
      );
    });
  });
});
