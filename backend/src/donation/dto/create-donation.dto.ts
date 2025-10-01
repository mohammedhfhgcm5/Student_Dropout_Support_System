// src/donation/dto/create-donation.dto.ts
import { IsInt, IsEnum, IsNumber } from "class-validator";
import { DonationStatus } from "@prisma/client";

export class CreateDonationDto {
  @IsInt()
  studentId: number;

  @IsInt()
  donorId: number;

  @IsInt()
  purposeId: number;

  @IsNumber()
  amount: number;

  @IsEnum(DonationStatus)
  status: DonationStatus;
}
