import { DataSource } from "typeorm";
import app from "../../src/app";
import { UserData } from "../../src/types/user.type";
import request from "supertest";
import { AppDataSource } from "../../src/database/data-source";
import truncateTables from "../utils/truncateTables";
import { User } from "../../src/entity";

describe("POST /auth/register", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await truncateTables(connection);
  });

  afterAll(async () => {
    await connection?.destroy();
  });

  describe("Given all fields", () => {
    it("should return 201 status code", async () => {
      // Arrange
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "manthan@gmail.com",
        password: "secret",
      };

      // Act
      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });

    it("should return valid json response", async () => {
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "manthan@gmail.com",
        password: "secret",
      };

      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json"),
      );
    });

    it("should persist user in the database", async () => {
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "manthan@gmail.com",
        password: "secret",
      };

      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(1);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
      expect(users[0].email).toBe(userData.email);
    });

    it("should return the id of the created user", async () => {
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "manthan@gmail.com",
        password: "secret",
      };

      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      expect(response.body).toHaveProperty("id");
    });
  });

  describe("Fields are missing", () => {});
});
