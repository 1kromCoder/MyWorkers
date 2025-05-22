import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MulterController } from './multer/multer.module';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { SessionModule } from './session/session.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RegionModule } from './region/region.module';
import { BrandModule } from './brand/brand.module';
import { CapacityModule } from './capacity/capacity.module';
import { SizeModule } from './size/size.module';
import { ToolModule } from './tool/tool.module';
import { ProductModule } from './product/product.module';
import { LevelModule } from './level/level.module';
import { MasterModule } from './master/master.module';
import { OrderModule } from './order/order.module';
import { CommentModule } from './comment/comment.module';
import { GeneralinfoModule } from './generalinfo/generalinfo.module';
import { ContactModule } from './contact/contact.module';
import { FaqModule } from './faq/faq.module';
import { ShowcaseModule } from './showcase/showcase.module';
import { PartnerModule } from './partner/partner.module';
import { BasketModule } from './basket/basket.module';
import { TelegramModule } from './bot/bot.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    MailModule,
    SessionModule,
    MulterModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
    RegionModule,
    BrandModule,
    CapacityModule,
    SizeModule,
    ToolModule,
    ProductModule,
    LevelModule,
    MasterModule,
    OrderModule,
    CommentModule,
    GeneralinfoModule,
    ContactModule,
    FaqModule,
    ShowcaseModule,
    PartnerModule,
    BasketModule,
    TelegramModule,
  ],
  controllers: [AppController, MulterController],
  providers: [AppService],
})
export class AppModule {}
