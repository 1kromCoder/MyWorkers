import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserYurDto {
  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  INN: string;

  @ApiProperty({ example: '20202029000100012345' })
  @IsString()
  @IsNotEmpty()
  R_S: string;

  @ApiProperty({ example: 'Toshkent sh., Chilonzor t., 10-kvartal' })
  @IsString()
  @IsNotEmpty()
  Address: string;

  @ApiProperty({ example: 'Hamkorbank' })
  @IsString()
  @IsOptional()
  Bank?: string;

  @ApiProperty({ example: '01180' })
  @IsString()
  @IsOptional()
  MFO?: string; 
}
