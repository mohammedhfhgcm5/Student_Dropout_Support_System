export type DonationStatus = "PENDING" | "CONFIRMED" | "ALLOCATED" | "USED";

export interface Donation {
  id: number;
  donorName: string;
  studentId: number;
  amount: number;
  status: DonationStatus;
  createdAt: string;
}
