import { DataSource } from "typeorm";
import request from "supertest";
import { AppDataSource } from "../../src/database/data-source";
import app from "../../src/app";
import { Tenant } from "../../src/entity";
import { CreateTenantData } from "../../src/types/tenant.type";

describe("POST /tenant/create", () => {
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
      const tenantData = {
        name: "Tenant name",
        address: "Tenant address",
      };

      const response = await request(app as any)
        .post("/tenants")
        .send(tenantData);

      expect(response.statusCode).toBe(201);
    });

    it("should return create tenant in database", async () => {
      const tenantData: CreateTenantData = {
        name: "Tenant name",
        address: "Tenant address",
      };

      const response = await request(app as any)
        .post("/tenants")
        .send(tenantData);

      const tenantRepository = connection.getRepository(Tenant);

      const tenants = await tenantRepository.find();

      expect(tenants).toHaveLength(1);
      expect(tenants[0].name).toBe(tenantData.name);
      expect(tenants[0].address).toBe(tenantData.address);
    });
  });
});
