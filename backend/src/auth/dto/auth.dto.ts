import { IsArray, IsBoolean, IsEmail, IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class PayloadDto {

  @IsString()
  @IsMongoId()
  id:number;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  nationalNumber?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  @IsIn(['FIELD_OFFICER', 'STAFF', 'ADMIN'])
  role?: 'FIELD_OFFICER' | 'STAFF' | 'ADMIN';

  @IsBoolean()
  approved?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  Preferences?: string[];

  @IsString()
  Permission?: string[];
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  newPassword: string;
}