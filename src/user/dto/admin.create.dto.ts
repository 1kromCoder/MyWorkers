import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export enum AdminRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  VIEWER_ADMIN = 'VIEWER_ADMIN',
}
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
  @IsNotEmpty()
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
  @IsEnum(AdminRole)
  @ApiProperty({ example: 'ADMIN', enum: [AdminRole.ADMIN] })
  role: AdminRole;
}
