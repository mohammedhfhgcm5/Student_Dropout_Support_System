import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto, ForgotPasswordDto, PayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { DonorService } from 'src/donor/donor.service';
import * as nodemailer from 'nodemailer';
import { CreateDonorDto } from 'src/donor/dto/create-donor.dto';

@Injectable()
export class AuthService {
  private transporter;

  constructor(
    private readonly userservice: UserService,
    private readonly donerservice: DonorService,
    private jwtService: JwtService,
  ) {
    // 🟢 إعداد البريد عبر Gmail App Password
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /* =======================================================
     🔹 1. تسجيل الدخول للمستخدم (Admin / Staff / Field)
  ======================================================= */
  async logIn(authBody: AuthDto) {
    const user = await this.userservice.getOneUserByEmail(authBody.email);

    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(authBody.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload: PayloadDto = {
      email: user.email,
      id: user.id,
      role: user.role,
      fullName: user.fullName,
    };

    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  /* =======================================================
     🔹 2. تسجيل مستخدم جديد
  ======================================================= */
  async signUp(signupBody: CreateUserDto) {
    if (!signupBody.password)
      throw new UnauthorizedException('Password is required');

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

  /* =======================================================
     🔹 3. تعديل بيانات المستخدم
  ======================================================= */
  async editDetails(userId: number, body: UpdateUserDto) {
    const updatedUser = await this.userservice.update(userId, body);
    return {
      status: true,
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  /* =======================================================
     🔹 4. نسيان كلمة المرور (User)
  ======================================================= */
  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userservice.getOneUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('User not found');

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(dto.newPassword, salt);

    await this.userservice.update(user.id, { password: newHashedPassword });

    return {
      status: true,
      message: 'Password updated successfully',
    };
  }

  /* =======================================================
     🔹 5. تسجيل دخول المتبرع
  ======================================================= */
  async DonorlogIn(authBody: AuthDto) {
    const donor = await this.donerservice.findOnebyemail(authBody.email);

    if (!donor) throw new UnauthorizedException('Donor not found');

    if (!donor.verified)
      throw new UnauthorizedException('Please verify your email first.');

    const isMatch = await bcrypt.compare(authBody.password, donor.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload: PayloadDto = {
      email: donor.email,
      id: donor.id,
      fullName: donor.name,
      nationalNumber: donor.nationalNumber,
      role: 'DONOR',
    };

    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  /* =======================================================
     🔹 6. تسجيل متبرع جديد + إرسال تحقق بالبريد
  ======================================================= */
  async DonorsignUp(signupBody: CreateDonorDto) {
    if (!signupBody.passwordHash)
      throw new UnauthorizedException('Password is required');

    const { passwordHash, email, ...rest } = signupBody;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(passwordHash, salt);

    const newDonor = await this.donerservice.create({
      ...rest,
      email,
      passwordHash: hashPassword,
      verified: false,
    });

    // إنشاء رمز التحقق (JWT)
    const token = this.jwtService.sign(
      { email },
      { secret: process.env.JWT_VERIFICATION_SECRET, expiresIn: '1d' },
    );

    // حفظ رمز التحقق في قاعدة البيانات
    await this.donerservice.update(newDonor.id, { verificationToken: token });

    // إرسال البريد الإلكتروني
    await this.sendVerificationEmail(email, token);

    return {
      status: true,
      message:
        'Donor registered successfully. Please verify your email address.',
    };
  }

  /* =======================================================
     🔹 7. إرسال البريد الإلكتروني للتحقق
  ======================================================= */
  private async sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: `"Student Support Platform" <no-reply@student-support.com>`,
      to: email,
      subject: 'Verify your email - Student Support Platform',
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="background: #007bff; padding: 20px; text-align: center; color: #fff;">
            <h1 style="margin: 0; font-size: 24px;">Student Support</h1>
          </div>
          <div style="padding: 30px; color: #333;">
            <h2>Verify your email</h2>
            <p>Hello 👋, please confirm your email by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="background: #007bff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Verify Email</a>
            </div>
            <p>If the button doesn't work, copy this link:</p>
            <a href="${verifyUrl}" style="color: #007bff;">${verifyUrl}</a>
          </div>
        </div>
      </div>
      `,
    });
  }

  /* =======================================================
     🔹 8. التحقق من البريد الإلكتروني (Donor)
  ======================================================= */
  async verifyEmail(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_VERIFICATION_SECRET,
      });

      const donor = await this.donerservice.findOnebyemail(payload.email);
      if (!donor) throw new UnauthorizedException('Invalid token');

      await this.donerservice.update(donor.id, {
        verified: true,
        verificationToken: undefined,
      });

      return `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Email Verified</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:40px;font-family:Arial;background:#f5f7fa;text-align:center;">
          <div style="background:#fff;padding:30px;border-radius:8px;max-width:500px;margin:auto;box-shadow:0 4px 10px rgba(0,0,0,0.1);">
            <h1 style="color:#28a745;">✅ Email Verified Successfully!</h1>
            <p style="font-size:16px;color:#333;">Thank you for confirming your account. You can now log in.</p>
          </div>
        </body>
        </html>
      `;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }
  }

  /* =======================================================
     🔹 9. تعديل بيانات المتبرع
  ======================================================= */
  async DonorEditDetails(userId: number, body: UpdateUserDto) {
    const updatedUser = await this.donerservice.update(userId, body);
    return {
      status: true,
      message: 'Donor updated successfully',
      user: updatedUser,
    };
  }

  /* =======================================================
     🔹 10. نسيان كلمة المرور (Donor)
  ======================================================= */
  async DonorforgotPassword(dto: ForgotPasswordDto) {
    const donor = await this.donerservice.findOnebyemail(dto.email);
    if (!donor) throw new UnauthorizedException('Donor not found');

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(dto.newPassword, salt);

    await this.donerservice.update(donor.id, {
      passwordHash: newHashedPassword,
    });

    return {
      status: true,
      message: 'Password updated successfully',
    };
  }
}
