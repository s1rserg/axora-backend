import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MediaModule } from '@modules/media';

import { ProductEntity } from './entities/product.entity';
import { ProductService } from './services/product.service';
import { ProductRepository } from './repositories/product.repository';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), MediaModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductService],
})
export class ProductModule {}
