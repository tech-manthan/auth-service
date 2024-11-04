import { DataSource } from "typeorm";
import app from "../../src/app";
import { UserData } from "../../src/types/user.type";
import request from "supertest";
import { AppDataSource } from "../../src/database/data-source";
import truncateTables from "../utils/truncateTables";
import { User } from "../../src/entity";
import { Roles } from "../../src/constants";

describe("POST /auth/register", () => {
  let connection: DataSource;

  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
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
        password: "Secret@123",
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
        password: "Secret@123",
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
        password: "Secret@123",
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
        password: "Secret@123",
      };

      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);

      expect(response.body).toHaveProperty("id");
    });

    it("should assign a customer role", async () => {
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "manthan@gmail.com",
        password: "Secret@123",
      };

      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users[0]).toHaveProperty("role");
      expect(users[0].role).toBe(Roles.CUSTOMER);
    });

    it("should store the hashed password in the database", async () => {
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "manthan@gmail.com",
        password: "Secret@123",
      };

      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users[0].password).not.toBe(userData.password);
      expect(users[0].password).toHaveLength(60);
      expect(users[0].password).toMatch(/^\$2(b|a)\$\d+\$/);
    });

    it("should return 400 status code if email is already exist", async () => {
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "manthan@gmail.com",
        password: "Secret@123",
      };
      const userRepository = connection.getRepository(User);

      await userRepository.save({
        ...userData,
        role: Roles.CUSTOMER,
      });

      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);
      const users = await userRepository.find();

      expect(response.statusCode).toBe(400);
      expect(users).toHaveLength(1);
    });
  });

  describe("Fields are missing", () => {
    it("should return 400 status code if email field is missing", async () => {
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "",
        password: "Secret@123",
      };

      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      expect(users).toHaveLength(0);
      expect(response.statusCode).toBe(400);
    });
  });

  describe("Fields are not in proper format", () => {
    it("should trim the email field", async () => {
      const userData: UserData = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: " manthan@gmail.com ",
        password: "Secret@123",
      };

      const response = await request(app as any)
        .post("/auth/register")
        .send(userData);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();

      console.log(response.body);

      expect(users[0].email).toBe("manthan@gmail.com");
    });
  });
});
