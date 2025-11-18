// src/services/donorAuth.service.ts
import * as SecureStore from "expo-secure-store";
import type {
  AuthResponse,
  DonorAuthDto,
  DonorSignupDto,
  ForgotPasswordDto,
} from "../types/donor";
import type { Donor } from "@/types/donor";
import { api } from "./http";

// ========= TOKEN HELPERS =========
export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync("donor_token", token);
};
export const getToken = async () => SecureStore.getItemAsync("donor_token");
export const removeToken = async () =>
  SecureStore.deleteItemAsync("donor_token");

// ========= DONOR API CALLS =========
const extractToken = (payload: any): string | undefined => {
  if (!payload) return undefined;
  // common shapes
  return (
    payload.accessToken ||
    payload.access_token ||
    payload.token ||
    payload?.data?.accessToken ||
    payload?.data?.access_token ||
    payload?.data?.token
  );
};

export const donorSignIn = async (dto: DonorAuthDto): Promise<AuthResponse> => {
  const { data } = await api.post<any>("/auth/donor-signin", dto);
  const token = extractToken(data);
  if (!token) throw new Error("Login failed: missing access token");
  await saveToken(token);
  return { ...(data || {}), accessToken: token } as AuthResponse;
};

export const donorSignUp = async (
  dto: DonorSignupDto
): Promise<AuthResponse> => {
  const { data } = await api.post<any>("/auth/donor-signup", dto);
  const token = extractToken(data);
  if (!token) throw new Error("Sign up failed: missing access token");
  await saveToken(token);
  return { ...(data || {}), accessToken: token } as AuthResponse;
};

export const donorForgotPassword = async (dto: ForgotPasswordDto) =>
  api.post("/auth/donor-forgot-password", dto);

export const donorLogout = async () => removeToken();

export default api;

// Fetch current donor using stored token
export const getCurrentDonor = async (): Promise<Donor | null> => {
  const token = await getToken();
  if (!token) return null;
  try {
    const { data } = await api.get<Donor>("/donors/profile");
    return data ?? null;
  } catch (e) {
    return null;
  }
};

// Get donor profile (explicit function name for clarity on screens)
export const getDonorProfile = async (): Promise<Donor | null> => {
  try {
    const { data } = await api.get<Donor>("/donors/profile");
    return data ?? null;
  } catch {
    return null;
  }
};

export const updateDonorProfile = async (
  dto: Partial<Pick<Donor, "name" | "email">> & { phone?: string }
): Promise<Donor> => {
  const { data } = await api.patch<Donor>("/donors/profile", dto);
  return data;
};

// Read-only: get authenticated donor's national number
export interface NationalNumberResponse {
  nationalNumber: string;
}

export const getDonorNationalNumber = async (): Promise<NationalNumberResponse> => {
  const { data } = await api.get<NationalNumberResponse>(
    "/donors/profile/national-number"
  );
  return data;
};
