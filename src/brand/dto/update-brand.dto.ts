import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';
import { IsString } from 'class-validator';

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiProperty()
  @IsString()
  name_uz?: string;
  @ApiProperty()
  @IsString()
  name_ru?: string;
  @ApiProperty()
  @IsString()
  name_en?: string;
}
