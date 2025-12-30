export interface LoginResponse {
  access_token: string;
  user: LoginUserResponse;
}

export interface LoginUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface CustomerWithoutPassword {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
  address: string;
  zipCode: string;
  city: string;
}

export interface UserRegister {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  city: string;
}

export interface RegisterResponse extends UserRegister {
  access_token: string;
}

export enum CartStatus {
  ACTIVE = 'active',
  CONVERTED = 'converted',
  ABANDONED = 'abandoned',
}

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  TO_PRINT = 'to_print',
  PRINTED = 'printed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
