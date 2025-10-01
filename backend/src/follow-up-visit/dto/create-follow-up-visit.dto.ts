// src/follow-up-visit/dto/create-follow-up-visit.dto.ts
import { IsDateString, IsInt, IsString } from "class-validator";

export class CreateFollowUpVisitDto {
  @IsInt()
  studentId: number;

  @IsDateString()
  date: string;

  @IsString()
  note: string;
}
