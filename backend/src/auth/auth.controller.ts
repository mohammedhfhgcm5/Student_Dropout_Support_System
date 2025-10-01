import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ForgotPasswordDto } from './dto/auth.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

import {  CreateUserDto} from 'src/user/dto/create-user.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin') // Now: POST /auth/signin
  signin(@Body() authBody: AuthDto) {
    return this.authService.logIn(authBody);
  }
 

  @Post('signup')
  async signup(
    @Body() signupBody: CreateUserDto,
    
  ) {
    
    return this.authService.signUp(signupBody);
  }


 

  @Put('edit/:id')
  editDetails(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.authService.editDetails(+id, body);
  }
 
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }


  @Post('doner-signin') // Now: POST /auth/signin
  donorsignin(@Body() authBody: AuthDto) {
    return this.authService.DonorlogIn(authBody);
  }

 @Post('donor-signup')
  async donorsignup(
    @Body() signupBody: CreateUserDto,
    
  ) {
    
    return this.authService.DonorsignUp(signupBody);
  }

 @Put('donor-edit/:id')
  donoreditDetails(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.authService.DonorEditDetails(+id, body);
  }


  @Post('donor-forgot-password')
  donorforgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.DonorforgotPassword(dto);
  }

 
}



