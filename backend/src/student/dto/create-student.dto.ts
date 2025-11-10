// src/student/dto/create-student.dto.ts
import { IsDateString, IsEnum, IsOptional, IsString, IsInt } from "class-validator";
import { Gender, StudentStatus } from "@prisma/client";

export class CreateStudentDto {
  @IsString()
  fullName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  nationalNumber: string;

  @IsEnum(StudentStatus)
  status: StudentStatus;

  @IsString()
  mainLanguage: string;

  @IsString()
  acquiredLanguage: string;
  @IsString()
  supportNeeds?: string;

  @IsOptional()
  @IsInt()
  guardianId?: number;

  @IsOptional()
  @IsInt()
  schoolId?: number;

  @IsOptional()
  @IsInt()
  locationId?: number;

  @IsOptional()
  @IsInt()
  dropoutReasonId?: number;
}
