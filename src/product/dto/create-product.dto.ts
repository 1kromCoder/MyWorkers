import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

class LevelObjectDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  levelId: string;

  @ApiProperty()
  @IsNumber()
  minWorkingHours: number;

  @ApiProperty()
  @IsNumber()
  price_hourly: number;

  @ApiProperty()
  @IsNumber()
  price_daily: number;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name_uz: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name_ru?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name_en?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  minWorkingHours: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  toolIds: string[];

  @ApiProperty({ type: [LevelObjectDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LevelObjectDto)
  levelObjects: LevelObjectDto[];
}
