// src/types/student.ts

// ===== ENUMS (same as backend) =====
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum StudentStatus {
  ACTIVE = "ACTIVE",
  DROPOUT = "DROPOUT",
  RETURNED = "RETURNED",
  AT_RISK = "AT_RISK",
}

// ===== TYPES =====
export interface Student {
  id: number;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  nationalNumber: string;
  status: StudentStatus;
  mainLanguage: string;
  acquiredLanguage?: string;
  supportNeeds?: string;
  guardianId?: number | null;
  schoolId?: number | null;
  locationId?: number | null;
  dropoutReasonId?: number | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateStudentDto {
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  nationalNumber: string;
  status: StudentStatus;
  mainLanguage: string;
  acquiredLanguage?: string;
  supportNeeds?: string;
  guardianId?: number;
  schoolId?: number;
  locationId?: number;
  dropoutReasonId?: number;
}

export interface UpdateStudentDto extends Partial<CreateStudentDto> {}
