// src/donor/dto/create-donor.dto.ts
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateDonorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  nationalNumber: string;
}
