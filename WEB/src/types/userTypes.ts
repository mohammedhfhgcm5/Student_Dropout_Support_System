export type Role = "ADMIN" | "NGO_STAFF" | "FIELD_TEAM";

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}
