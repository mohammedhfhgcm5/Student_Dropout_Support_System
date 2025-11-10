import { apiClient } from "../api/apiConfig";
import type {
  AuthResponse,
  SignInDto,
  SignUpDto,
  UpdateUserDto,
  ForgotPasswordDto,
} from "../types/authTypes";

export const authService = {
  // 🔹 Sign In
  signin: async (data: SignInDto): Promise<AuthResponse> => {
    const res = await apiClient.post("/auth/signin", data);
    return res.data;
  },

  // 🔹 Sign Up (NGO/Field)
  signup: async (data: SignUpDto): Promise<AuthResponse> => {
    const res = await apiClient.post("/auth/signup", data);
    return res.data;
  },

  // 🔹 Edit profile
  edit: async (id: number, data: UpdateUserDto): Promise<AuthResponse> => {
    const res = await apiClient.put(`/auth/edit/${id}`, data);
    return res.data;
  },

  // 🔹 Forgot password
  forgotPassword: async (data: ForgotPasswordDto) => {
    const res = await apiClient.post("/auth/forgot-password", data);
    return res.data;
  },



};
