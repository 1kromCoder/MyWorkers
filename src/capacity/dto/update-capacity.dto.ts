import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCapacityDto } from './create-capacity.dto';
import { IsString } from 'class-validator';

export class UpdateCapacityDto extends PartialType(CreateCapacityDto) {
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
