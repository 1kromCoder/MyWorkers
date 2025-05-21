import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSizeDto {
  @ApiProperty()
  @IsString()
  name_uz: string;
  @ApiProperty()
  @IsString()
  name_ru?: string;
  @ApiProperty()
  @IsString()
  name_en?: string;
}
