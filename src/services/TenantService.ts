import { Repository } from "typeorm";
import { TenantServiceConstructor } from "../types/service.type";
import { Tenant } from "../entity";
import createHttpError from "http-errors";
import { CreateTenantData } from "../types/tenant.type";

export default class TenantService {
  private tenantRepository: Repository<Tenant>;

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
}
