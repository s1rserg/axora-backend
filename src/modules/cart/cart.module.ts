import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CartItemEntity } from './entities/cart-item.entity';
import { CartService } from './services/cart.service';
import { CartRepository } from './repositories/cart.repository';
import { CartController } from './cart.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartItemEntity]), ProductModule],
  controllers: [CartController],
  providers: [CartService, CartRepository],
  exports: [CartService],
})
export class CartModule {}
