export interface TenantData {
  id?: number;
  name: string;
  address: string;
}

export interface CreateTenantData {
  name: string;
  address: string;
}

export interface UpdateTenantData {
  name?: string;
  address?: string;
}
