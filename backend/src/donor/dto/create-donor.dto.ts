// src/donor/dto/create-donor.dto.ts
import { IsBoolean, IsEmail, IsString, MinLength } from "class-validator";

export class CreateDonorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  passwordHash: string;

  @IsString()
  nationalNumber: string;
  @IsString()
  phone: string;
  @IsString()
  verificationToken?: string;

  @IsBoolean()
  verified?: boolean



  
}
