import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthDto, ForgotPasswordDto, PayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { DonorService } from 'src/donor/donor.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userservice: UserService,
    private readonly donerservice: DonorService,

    private jwtService: JwtService,
  ) {}

  async logIn(authBody: AuthDto) {
    const user = await this.userservice.getOneUserByEmail(authBody.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
   

    const isMatch = await bcrypt.compare(authBody.password, user.password!);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload : PayloadDto = {
      email: user.email,
      id: user.id,
      role: user.role,
      fullName: user.fullName,
      nationalNumber: user.nationalNumber,
};

    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }



  async signUp(signupBody: CreateUserDto) {

    
    if (!signupBody.password) {
      throw new UnauthorizedException('Password is required');
    }

    const { password, ...rest } = signupBody;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await this.userservice.create({
      ...rest,
      password: hashPassword,
    });

    return {
      status: true,
      message: 'User created successfully',
      user: newUser,
    };
  }


  async editDetails(userId: number, body: UpdateUserDto) {
    const updatedUser = await this.userservice.update(userId, body);
    return {
      status: true,
      message: 'User updated successfully',
      user: updatedUser,
    };
  }


  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.donerservice.findOnebyemail(dto.email);
    if (!user) throw new UnauthorizedException('User not found');

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(dto.newPassword, salt);

    await this.userservice.update(user.id, { password: newHashedPassword });

    return {
      status: true,
      message: 'Password updated successfully',
    };
  }


  async DonorlogIn(authBody: AuthDto) {
    const user = await this.donerservice.findOnebyemail(authBody.email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }
   

    const isMatch = await bcrypt.compare(authBody.password, user.password!);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload : PayloadDto = {
      email: user.email,
      id: user.id,
      fullName: user.name,
      nationalNumber: user.nationalNumber,
};

    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  async DonorsignUp(signupBody: CreateUserDto) {

    
    if (!signupBody.password) {
      throw new UnauthorizedException('Password is required');
    }

    const { password, ...rest } = signupBody;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await this.userservice.create({
      ...rest,
      password: hashPassword,
    });

    return {
      status: true,
      message: 'User created successfully',
      user: newUser,
    };
  }

  async DonorEditDetails(userId: number, body: UpdateUserDto) {
    const updatedUser = await this.donerservice.update(userId, body);
    return {
      status: true,
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  async DonorforgotPassword(dto: ForgotPasswordDto) {
    const user = await this.donerservice.findOnebyemail(dto.email);
    if (!user) throw new UnauthorizedException('User not found');

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(dto.newPassword, salt);

    await this.userservice.update(user.id, { password: newHashedPassword });

    return {
      status: true,
      message: 'Password updated successfully',
    };
  }
}



