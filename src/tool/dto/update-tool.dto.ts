import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateToolDto } from './create-tool.dto';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateToolDto extends PartialType(CreateToolDto) {
  @ApiProperty()
  @IsString()
  name_uz?: string;
  @ApiProperty()
  @IsString()
  description_uz?: string;
  @ApiProperty()
  @IsString()
  code?: string;
  @ApiProperty()
  @IsNumber()
  price?: number;
  @ApiProperty()
  @IsNumber()
  quantity?: number;
  @ApiProperty()
  @IsBoolean()
  isActive?: boolean;
  @ApiProperty()
  @IsString()
  brandId?: string;
  @ApiProperty()
  @IsString()
  capacityId?: string;
  @ApiProperty()
  @IsString()
  sizeId?: string;
  @ApiProperty()
  @IsString()
  image?: string;
}
