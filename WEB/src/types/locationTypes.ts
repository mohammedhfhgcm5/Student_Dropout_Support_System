export interface Location {
  id: number;
  name: string;
  region: string;
}

export interface CreateLocationDto {
  name: string;
  region: string;
}

export type UpdateLocationDto = Partial<CreateLocationDto>;
