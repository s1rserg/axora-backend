import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavoriteEntity } from './entities/favorite.entity';
import { FavoriteService } from './services/favorite.service';
import { FavoriteRepository } from './repositories/favorite.repository';
import { FavoriteController } from './favorite.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([FavoriteEntity]), ProductModule],
  controllers: [FavoriteController],
  providers: [FavoriteService, FavoriteRepository],
  exports: [FavoriteService],
})
export class FavoriteModule {}
