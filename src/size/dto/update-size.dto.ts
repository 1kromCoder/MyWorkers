import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSizeDto } from './create-size.dto';
import { IsString } from 'class-validator';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {
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
