import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../src/database/data-source";
import app from "../../src/app";
import createJWKSMock from "mock-jwks";
import { Tenant } from "../../src/entity";
import { CreateTenantData } from "../../src/types/tenant.type";
import { Roles } from "../../src/constants";

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
    it("should return 201 status code", async () => {
      const tenantData = {
        name: "Tenant name",
        address: "Tenant address",
      };

      const accessToken = jwks.token({
        sub: "1",
        role: Roles.ADMIN,
      });

      const response = await request(app as any)
        .post("/tenants")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send(tenantData);

      expect(response.statusCode).toBe(201);
    });

    it("should create tenant is database", async () => {
      const tenantData = {
        name: "Tenant name",
        address: "Tenant address",
      };

      const accessToken = jwks.token({
        sub: "1",
        role: Roles.ADMIN,
      });

      const response = await request(app as any)
        .post("/tenants")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send(tenantData);

      const tenantRepository = connection.getRepository(Tenant);

      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });

    it("should return 401 if user is not authenticated", async () => {
      const tenantData: CreateTenantData = {
        name: "Tenant name",
        address: "Tenant address",
      };

      const response = await request(app as any)
        .post("/tenants")
        .set("Cookie", [`accessToken=${""};`])
        .send(tenantData);

      const tenantRepository = connection.getRepository(Tenant);

      const tenants = await tenantRepository.find();

      expect(response.statusCode).toBe(401);
      expect(tenants).toHaveLength(0);
    });

    it("should return 403 if user is not admin", async () => {
      const tenantData: CreateTenantData = {
        name: "Tenant name",
        address: "Tenant address",
      };

      const accessToken = jwks.token({
        sub: "1",
        role: Roles.MANAGER,
      });

      const response = await request(app as any)
        .post("/tenants")
        .set("Cookie", [`accessToken=${accessToken};`])
        .send(tenantData);

      const tenantRepository = connection.getRepository(Tenant);

      const tenants = await tenantRepository.find();

      expect(response.statusCode).toBe(403);
      expect(tenants).toHaveLength(0);
    });
  });
});
