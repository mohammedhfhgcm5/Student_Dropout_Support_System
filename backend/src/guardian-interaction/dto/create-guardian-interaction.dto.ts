import { IsEnum, IsInt, IsOptional, IsString, IsDateString } from "class-validator";
import { InteractionType } from "@prisma/client";

export class CreateGuardianInteractionDto {
  @IsInt()
  studentId: number;

  @IsInt()
  guardianId: number;

  @IsEnum(InteractionType)
  interactionType: InteractionType;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
