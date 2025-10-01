// src/guardian/dto/create-guardian.dto.ts
import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateGuardianDto {
  @IsString()
  fullName: string;

  @IsString()
  nationalNumber: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  relationship: string;
}
