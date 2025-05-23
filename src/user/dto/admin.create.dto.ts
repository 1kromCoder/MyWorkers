import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAdmin {
  @ApiProperty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsString()
  lastName: string;
  @ApiProperty({ example: '+998931234567' })
  @IsPhoneNumber()
  phone: string;
  @ApiProperty()
  @IsString()
  password: string;
  @ApiProperty({ example: 'exaple@gmail.com' })
  @IsEmail()
  email: string;
  @ApiProperty({ example: '1236545209' })
  @IsString()
  tgId: string;
  @ApiProperty()
  @IsUUID()
  regionId: string;
  @ApiProperty({ example: 'ADMIN' })
  @IsString()
  role: string;
}
export enum AdminRole {
  ADMIN = 'ADMIN',
}
