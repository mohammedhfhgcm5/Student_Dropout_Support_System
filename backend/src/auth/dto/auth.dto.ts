import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class PayloadDto {
  @IsOptional()
  id?: number; // ✅ PostgreSQL يستخدم number وليس MongoId

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  nationalNumber?: string;

  @IsOptional()
  @IsIn(['FIELD_TEAM', 'NGO_STAFF', 'ADMIN', 'DONOR'])
  role?: 'FIELD_TEAM' | 'NGO_STAFF' | 'ADMIN' | 'DONOR';
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  newPassword: string;
}
