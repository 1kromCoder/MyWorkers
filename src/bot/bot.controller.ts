import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from './bot.module';
import { AppController } from 'src/app.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), TelegramModule],
  controllers: [AppController],
})
export class AppModule {}
