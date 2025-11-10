import {
  IsInt,
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { VisitType } from '@prisma/client';

export class CreateFollowUpVisitDto {
  @IsInt()
  studentId: number;

  @IsInt()
  userId: number;

  @IsDateString()
  visitDate: string; // 🕓 التاريخ بصيغة ISO (مثلاً "2025-11-03T10:00:00Z")

  @IsEnum(VisitType)
  visitType: VisitType; // 📋 ENUM مثل INITIAL, REGULAR, EMERGENCY

  @IsOptional()
  @IsString()
  notes?: string; // 📝 ملاحظات عامة

  @IsOptional()
  @IsBoolean()
  guardianPresent?: boolean; // 👨‍👩‍👧 حضور ولي الأمر

  @IsOptional()
  @IsString()
  studentStatusAssessment?: string; // 🔍 تقييم حالة الطالب

  @IsOptional()
  @IsString()
  recommendations?: string; // 💡 توصيات الزيارة
}
