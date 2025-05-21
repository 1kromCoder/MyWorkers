import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateCommentMasterDto {
  @ApiProperty()
  @IsUUID()
  masterId: string;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(5)
  star: number;
}

export class CreateCommentDto {
  @ApiProperty()
  @IsUUID()
  orderId: string;

  @ApiProperty({ example: 'good' })
  @IsString()
  message: string;

  @ApiProperty({
    type: () => CreateCommentMasterDto,
    isArray: true,
    example: [{ masterId: 'masterId-1', star: 0 }],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCommentMasterDto)
  commentMasters: CreateCommentMasterDto[];
}
