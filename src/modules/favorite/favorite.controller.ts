import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TransformPlainToInstance } from 'class-transformer';

import { ActiveUser } from '@common/types';
import { ProductResponseDto } from '@common/dto/product/product-response.dto';
import { RequestUser } from '@common/decorators/active-user.decorator';

import { Product } from '../product/types';
import { FavoriteService } from './services/favorite.service';

@Controller('favorites')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  @TransformPlainToInstance(ProductResponseDto)
  async findAll(@RequestUser() user: ActiveUser): Promise<Product[]> {
    return this.favoriteService.findAll(user.id);
  }

  @Post('toggle/:productId')
  async toggle(
    @RequestUser() user: ActiveUser,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.favoriteService.toggle(user.id, productId);
  }
}
