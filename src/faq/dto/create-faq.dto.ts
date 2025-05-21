import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty()
  @IsString()
  question: string;
  @ApiProperty()
  @IsString()
  answer: string;
}
