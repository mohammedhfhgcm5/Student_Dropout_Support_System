// ==============================
// ENUMS (match backend exactly)
// ==============================
export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export const StudentStatus = {
  ACTIVE: "ACTIVE",
  DROPOUT: "DROPOUT",
  RETURNED: "RETURNED",
  AT_RISK: "AT_RISK",
} as const;
export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];

// ==============================
// MODELS
// ==============================
export interface Student {
  id: number;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  nationalNumber: string;
  status: StudentStatus;
  mainLanguage: string;
  acquiredLanguage: string;
  supportNeeds?: string;
  guardianId: number; // ✅ required
  schoolId?: number;
  locationId?: number;
  dropoutReasonId?: number;
  createdAt?: string;
  updatedAt?: string;

  guardian?: any;
  school?: any;
  location?: any;
  dropoutReason?: any;
  donations?: any[];
  followUpVisits?: any[];
  documents?: any[];
}

// ==============================
// DTOs
// ==============================
export interface CreateStudentDto {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  nationalNumber: string;
  status: StudentStatus;
  mainLanguage: string;
  acquiredLanguage: string;
  supportNeeds?: string;
  guardianId: number; // ✅ required
  schoolId?: number;
  locationId?: number;
  dropoutReasonId?: number;
}

export type UpdateStudentDto = Partial<CreateStudentDto>;
