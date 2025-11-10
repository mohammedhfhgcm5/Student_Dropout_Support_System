import type { User } from "./userTypes";

export type Role = "ADMIN" | "NGO_STAFF" | "FIELD_TEAM";



export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  fullName: string;
  email: string;
  password: string;
  role?: Role; // default handled in backend
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  password?: string;
}

export interface ForgotPasswordDto {
  email: string;
  newPassword: string;
}
