export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tenantId?: number;
}

export interface CreateUserData extends UserData {
  role: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  role: string;
  tenantId?: number;
}

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginUserData {
  email: string;
  password: string;
}
