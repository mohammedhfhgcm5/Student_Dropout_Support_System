import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDonationDto {
  @IsInt()
  donorId: number;

  @IsInt()
  purposeId: number;

  @IsOptional()
  @IsInt()
  studentId?: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string;
}
