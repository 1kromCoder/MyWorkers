import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateStar {
  @ApiProperty()
  @IsString()
  masterId: string;
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(5)
  star: number;
}
