export interface Donor {
  id: number;
  name: string;
  email: string;
  nationalNumber: string;
  phone?: string;
  isAnonymous: boolean;
  verified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  donor: Donor;
}

export interface DonorAuthDto {
  email: string;
  password: string;
}

export interface DonorSignupDto {
  name: string;
  email: string;
  password: string;
  nationalNumber: string;
  phone?: string;
  isAnonymous?: boolean;
}

export interface ForgotPasswordDto {
  email: string;
  newPassword: string;
}
