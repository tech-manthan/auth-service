export interface UserData {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
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
