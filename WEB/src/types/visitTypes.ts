export interface FollowUpVisit {
  id: number;
  studentId: number;
  userId: number;
  visitDate: string;
  visitType: "INITIAL" | "FOLLOW_UP";
  notes?: string;
  guardianPresent: boolean;
  recommendations?: string;
}
