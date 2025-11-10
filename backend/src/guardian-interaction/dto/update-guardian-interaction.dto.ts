import { IsEnum, IsOptional, IsString, IsDateString } from "class-validator";
import { InteractionType } from "@prisma/client";

export class UpdateGuardianInteractionDto {
  @IsOptional()
  @IsEnum(InteractionType)
  interactionType?: InteractionType;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

