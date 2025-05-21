import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductObjectDto {
  @ApiProperty()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  levelId: string;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  minWorkingHours: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  price_hourly: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  price_daily: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  experience: number;
}

export class CreateMasterDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: '2000' })
  @IsInt()
  year: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  passportImage?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  about?: string;

  @ApiProperty({ type: [ProductObjectDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductObjectDto)
  @IsOptional()
  productObjects?: ProductObjectDto[];
}
