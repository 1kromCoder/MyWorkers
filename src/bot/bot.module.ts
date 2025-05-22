import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramService } from './bot.service';

@Module({
  imports: [ConfigModule], 
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}