export interface DonationPurpose {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface CreateDonationPurposeDto {
  name: string;
}
