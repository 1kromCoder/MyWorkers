import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsInt, IsPositive } from 'class-validator';
import { MeasureType } from '@prisma/client';

export class CreateBasketItemDto {
  @ApiProperty()
  @IsUUID()
  productId: string;
  @ApiProperty()
  @IsUUID()
  levelId: string;

  @ApiProperty({ enum: MeasureType })
  @IsEnum(MeasureType)
  measure: MeasureType;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  count: number;

  @ApiProperty()
  @IsInt()
  total: number;

  @ApiProperty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty()
  @IsUUID()
  toolId: string;
}
