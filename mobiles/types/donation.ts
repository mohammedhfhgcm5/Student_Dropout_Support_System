export interface Donation {
  id: number;
  donorId: number;
  purposeId: number;
  studentId?: number | null;
  amount: number;
  currency: string;
  status?: string;
  paymentMethod?: string;
  transactionReference?: string;
  donationDate?: string;
  createdAt: string;
  updatedAt: string;
  donor?: { id: number; fullName: string };
  student?: { id: number; fullName: string };
  purpose?: { id: number; title?: string; name?: string };
}

export interface CreateDonationDto {
  donorId: number;
  purposeId: number;
  studentId?: number;
  amount: number;
  currency?: string;
}
