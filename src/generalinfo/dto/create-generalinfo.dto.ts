import {
  IsEmail,
  IsJSON,
  IsArray,
  IsObject,
  IsString,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGeneralInfoDto {
  @ApiProperty({ example: 'info@yourcompany.com' })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: ['+998901234567', '+998991112233'],
    description: 'Telefon raqamlar ro‘yxati',
  })
  @IsArray()
  @IsString({ each: true })
  phones: string[];

  @ApiProperty({
    example: {
      telegram: 'https://t.me/your_channel',
      instagram: 'https://instagram.com/your_page',
    },
    description: 'Ijtimoiy tarmoqlar linklari',
  })
  @IsObject()
  links: Record<string, string>;
}
