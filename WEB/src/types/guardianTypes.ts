// src/types/guardianTypes.ts
export interface Guardian {
  id: number;
  fullName: string;
  nationalNumber: string;
  phone?: string;
  relationToStudent: string;
  notes?: string;
  createdAt: string;
}

export interface CreateGuardianDto {
  fullName: string;
  nationalNumber: string;
  phone?: string;
  relationToStudent: string;
}

export interface UpdateGuardianDto extends Partial<CreateGuardianDto> {}
