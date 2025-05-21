import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MailService {
  constructor(private readonly prisma: PrismaService) {}
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'odilbek3093@gmail.com',
      pass: 'ouli ileb tlqw xvcw',
    },
  });

  private otpStorage = new Map<string, string>();

  async sendOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.transporter.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });
    this.otpStorage.set(email, otp);
    return otp;
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const storedOtp = this.otpStorage.get(email);
    if (storedOtp === otp) {
      await this.prisma.verifyEmail.upsert({
        where: { email },
        update: {},
        create: { email },
      });
      this.otpStorage.delete(email);
      return true;
    }
    return false;
  }

  async sendEmail(to: string, subject: string, text: string) {
    return await this.transporter.sendMail({ to, subject, text });
  }
}
