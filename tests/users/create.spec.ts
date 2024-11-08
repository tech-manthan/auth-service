import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../src/database/data-source";
import app from "../../src/app";
import createJWKSMock from "mock-jwks";
import { Tenant, User } from "../../src/entity";
import { CreateTenantData } from "../../src/types/tenant.type";
import { Roles } from "../../src/constants";
import { UserData } from "../../src/types/user.type";

describe("POST /tenant/create", () => {
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
    it("should persist user in data", async () => {
      const accessToken = jwks.token({
        sub: "1",
        role: Roles.ADMIN,
      });

      const tenantRepository = connection.getRepository(Tenant);
      const tenant = await tenantRepository.save({
        name: "Tenant 1",
        address: "Tenant 1 Address",
      });

      const userData: UserData = {
        firstName: "Manager",
        lastName: "1",
        email: "manager1@gmail.com",
        password: "Manager@123",
        tenantId: tenant.id,
      };

      const response = await request(app as any)
        .post("/users")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send(userData);

      const userRepository = connection.getRepository(User);

      const users = await userRepository.find({
        relations: ["tenant"],
      });

      expect(users).toHaveLength(1);
      expect(users[0].tenant.id).toBe(tenant.id);
      expect(users[0].email).toBe(userData.email);
      expect(users[0].firstName).toBe(userData.firstName);
      expect(users[0].lastName).toBe(userData.lastName);
    });

    it("should create manager user", async () => {
      const accessToken = jwks.token({
        sub: "1",
        role: Roles.ADMIN,
      });

      const tenantRepository = connection.getRepository(Tenant);
      const tenant = await tenantRepository.save({
        name: "Tenant 1",
        address: "Tenant 1 Address",
      });

      const userData: UserData = {
        firstName: "Manager",
        lastName: "1",
        email: "manager1@gmail.com",
        password: "Manager@123",
        tenantId: tenant.id,
      };

      const response = await request(app as any)
        .post("/users")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send(userData);

      const userRepository = connection.getRepository(User);

      const users = await userRepository.find({
        relations: ["tenant"],
      });

      expect(users).toHaveLength(1);
      expect(users[0].role).toBe(Roles.MANAGER);
    });

    it("should return 403 if user is not admin", async () => {
      const accessToken = jwks.token({
        sub: "1",
        role: Roles.MANAGER,
      });

      const tenantRepository = connection.getRepository(Tenant);
      const tenant = await tenantRepository.save({
        name: "Tenant 1",
        address: "Tenant 1 Address",
      });

      const userData: UserData = {
        firstName: "Manager",
        lastName: "1",
        email: "manager1@gmail.com",
        password: "Manager@123",
        tenantId: tenant.id,
      };

      const response = await request(app as any)
        .post("/users")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send(userData);

      const userRepository = connection.getRepository(User);

      const users = await userRepository.find({
        relations: ["tenant"],
      });

      expect(response.statusCode).toBe(403);
      expect(users).toHaveLength(0);
    });
  });
});
