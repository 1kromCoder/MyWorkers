import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class CreateShowcaseDto {
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
  image: string;
  @ApiProperty({ example: 'http://kun.uz' })
  @IsString()
  link: string;
}
