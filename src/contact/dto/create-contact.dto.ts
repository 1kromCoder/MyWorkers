import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'alex' })
  @IsString()
  userName: string;
  @ApiProperty({ example: 'aliyev' })
  @IsString()
  sureName: string;
  @ApiProperty({ example: '+998931234567' })
  @IsString()
  @IsNumberString()
  phone: string;
  @ApiProperty({ example: 'Toshkent city mall' })
  @IsString()
  address: string;
  @ApiProperty()
  @IsString()
  message: string;
}
