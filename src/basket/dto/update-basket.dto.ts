import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { CreateBasketItemDto } from './create-basket.dto';

export class UpdateBasketDto extends PartialType(CreateBasketItemDto) {}
