import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateGeneralInfoDto } from './create-generalinfo.dto';

export class UpdateGeneralinfoDto extends PartialType(CreateGeneralInfoDto) {
  @ApiProperty({ example: 'info@yourcompany.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: ['+998901234567', '+998991112233'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones?: string[];

  @ApiProperty({
    example: {
      telegram: 'https://t.me/your_channel',
      instagram: 'https://instagram.com/your_page',
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  links?: Record<string, string>;
}
