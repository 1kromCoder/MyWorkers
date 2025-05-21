import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLevelDto } from './create-level.dto';
import { IsString } from 'class-validator';

export class UpdateLevelDto extends PartialType(CreateLevelDto) {
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
