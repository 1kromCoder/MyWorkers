import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '@prisma/client';
import { CreateUserYurDto } from './create-yur.dto';

export class CreateUserDto {
  @ApiProperty({ example: 'Ali' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Valiyev' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+998931234567' })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ enum: UserRole, example: 'USER_FIZ' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  regionId: string;
  @ApiProperty({ example: '1236545209' })
  @IsString()
  tgId: string;
  @IsOptional()
  @ApiProperty({ type: CreateUserYurDto })
  @ValidateNested()
  @Type(() => CreateUserYurDto)
  User_YUR?: CreateUserYurDto;
}
