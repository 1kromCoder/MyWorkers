import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'okay',
    }),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService, MailModule],
})
export class UserModule {}
