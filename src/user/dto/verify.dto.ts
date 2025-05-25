import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  @IsString()
  otp: string;
}
