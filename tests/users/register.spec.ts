import app from "../../src/app";
import { RegisterUser } from "../../src/types/user.type";
import request from "supertest";

describe("POST /auth/register", () => {
  describe("Given all fields", () => {
    it("should return 201 status code", async () => {
      // Arrange
      const userData: RegisterUser = {
        firstName: "Manthan",
        lastName: "Sharma",
        email: "manthan@gmail.com",
        password: "secret",
      };

      // Act
      const response = await request(app).post("/auth/register").send(userData);

      // Assert
      expect(response.statusCode).toBe(201);
    });
  });

  describe("Fields are missing", () => {});
});
