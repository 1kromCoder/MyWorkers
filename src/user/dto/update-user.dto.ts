import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserRole } from '@prisma/client';
import { CreateUserDto } from './create-user.dto';
import { CreateUserYurDto } from './create-yur.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsString()
  firstName?: string;
  @ApiProperty()
  @IsString()
  lastName?: string;
  @ApiProperty()
  @IsString()
  password?: string;
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email?: string;
  @ApiProperty()
  @IsPhoneNumber()
  phone?: string;
  @ApiProperty({ enum: UserRole, example: 'USER_FIZ' })
  @IsEnum(UserRole)
  role?: UserRole;
  @ApiProperty()
  @IsString()
  regionId?: string;
  @ApiProperty({ example: '12365452' })
  @IsString()
  tgId?: string;
  @IsOptional()
  @ApiProperty({ type: CreateUserYurDto })
  @ValidateNested()
  @Type(() => CreateUserYurDto)
  User_YUR?: CreateUserYurDto;
}
