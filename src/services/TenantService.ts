import { Repository } from "typeorm";
import { TenantServiceConstructor } from "../types/service.type";
import { Tenant } from "../entity";
import createHttpError from "http-errors";
import { CreateTenantData, UpdateTenantData } from "../types/tenant.type";

export default class TenantService {
  private readonly tenantRepository: Repository<Tenant>;

  constructor({ tenantRepository }: TenantServiceConstructor) {
    this.tenantRepository = tenantRepository;
  }

  async create({ name, address }: CreateTenantData) {
    try {
      return await this.tenantRepository.save({
        name,
        address,
      });
    } catch {
      throw createHttpError(500, "database error while saving tenant");
    }
  }

  async getAll() {
    try {
      return await this.tenantRepository.find();
    } catch {
      throw createHttpError(500, "database error while fetching tenants");
    }
  }

  async getById(tenantId: number) {
    try {
      return await this.tenantRepository.findOne({
        where: {
          id: tenantId,
        },
      });
    } catch {
      throw createHttpError(500, "database error while fetching tenant");
    }
  }

  async delete(tenantId: number) {
    try {
      return await this.tenantRepository.delete(tenantId);
    } catch {
      throw createHttpError(500, "database error while fetching tenant");
    }
  }

  async update(tenantId: number, { address, name }: UpdateTenantData) {
    try {
      return await this.tenantRepository.update(tenantId, {
        address,
        name: name,
      });
    } catch {
      throw createHttpError(500, "database error while fetching tenant");
    }
  }
}
