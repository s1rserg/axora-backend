import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ExceptionFilterModule } from '@app/exception-filter';
import { AppConfigModule } from '@infrastructure/app-config';
import { AppJwtModule } from '@infrastructure/app-jwt-module';
import { DatabaseModule } from '@infrastructure/database';
import { AuthModule } from '@modules/auth';
import { ProductModule } from '@modules/product/product.module';
import { UserModule } from '@modules/user';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { CartModule } from './modules/cart/cart.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { MediaModule } from './modules/media/media.module';

@Module({
  imports: [
    AppConfigModule,
    ExceptionFilterModule,
    DatabaseModule,
    AppJwtModule,
    UserModule,
    AuthModule,
    MediaModule,
    ProductModule,
    FavoriteModule,
    CartModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
