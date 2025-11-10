export interface School {
  id: number;
  name: string;
  address?: string;
  region: string;
  locationId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSchoolDto {
  name: string;
  address?: string;
  region: string;
  locationId?: number; // ✅ added
}

export type UpdateSchoolDto = Partial<CreateSchoolDto>;
