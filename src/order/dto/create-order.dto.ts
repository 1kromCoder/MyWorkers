import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { MeasureType, PayType, StatusType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({ example: 41.311081 })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 69.240562 })
  @IsNumber()
  long: number;
}

export class OrderProductToolDto {
  @ApiProperty({ example: 'toolId' })
  @IsUUID()
  @IsNotEmpty()
  toolId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @IsPositive()
  count: number;
}

export class OrderProductDto {
  @ApiProperty({ example: 'productId' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'levelId' })
  @IsUUID()
  @IsNotEmpty()
  levelId: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  count: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({ enum: MeasureType, example: MeasureType.HOUR })
  @IsEnum(MeasureType)
  measure: MeasureType;

  @ApiProperty({ type: () => [OrderProductToolDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductToolDto)
  OrderProductTool?: OrderProductToolDto[];
}

// export class OrderToolDto {
//   @ApiProperty({ example: 'tool-id-2' })
//   @IsString()
//   toolId: string;

//   @ApiProperty({ example: 3 })
//   @IsNumber()
//   count: number;
// }

export class CreateOrderDto {
  @ApiProperty({ example: 120000 })
  @IsNumber()
  total: number;

  @ApiProperty({ example: 'Toshkent shahar, Chilonzor 10-daha' })
  @IsString()
  address: string;

  @ApiProperty({ type: () => LocationDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @ApiProperty({ example: '2025-06-01T12:00:00.000Z' }) // yoki '2025-06-01'
  @IsDateString()
  date: string;

  @ApiProperty({ enum: PayType, example: PayType.CASH })
  @IsEnum(PayType)
  payType: PayType;

  @ApiProperty({ example: true })
  @IsBoolean()
  withDelivery: boolean;

  @ApiProperty({ enum: StatusType, example: StatusType.PENDING })
  @IsEnum(StatusType)
  status: StatusType;

  @ApiProperty({ example: 'Eshik oldida qo‘yib keting', required: false })
  @IsOptional()
  @IsString()
  commentToDelivery?: string;

  @ApiProperty({ type: () => [OrderProductDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  OrderProduct?: OrderProductDto[];

  // @ApiProperty({ type: () => [OrderToolDto], required: false })
  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => OrderToolDto)
  // OrderTool?: OrderToolDto[];

  @ApiProperty({ example: ['masterId'] })
  @IsOptional()
  @IsArray()
  OrderMaster?: string[];
}
