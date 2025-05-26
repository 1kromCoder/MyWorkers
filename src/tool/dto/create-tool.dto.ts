import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateToolDto {
  @ApiProperty()
  @IsString()
  name_uz: string;
  @ApiProperty()
  @IsString()
  name_ru?: string;
  @ApiProperty()
  @IsString()
  name_en?: string;
  @ApiProperty()
  @IsString()
  description_uz: string;
  @ApiProperty()
  @IsString()
  description_ru?: string;
  @ApiProperty()
  @IsString()
  description_en?: string;
  @ApiProperty()
  @IsString()
  code: string;
  @ApiProperty()
  @IsInt()
  @IsPositive()
  price: number;
  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;
  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  brandId: string;
  @ApiProperty()
  @IsOptional()
  @IsUUID()
  @IsNotEmpty()
  capacityId: string;
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  sizeId: string;
  @ApiProperty()
  @IsString()
  image?: string;
}
