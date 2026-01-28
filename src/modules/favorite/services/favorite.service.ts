import { Injectable } from '@nestjs/common';

import { Product } from '../../product/types';
import { ProductService } from '../../product/services/product.service';
import { FavoriteRepository } from '../repositories/favorite.repository';
import { toProductMapper } from '../../product/mappers/to-product.mapper';

@Injectable()
export class FavoriteService {
  constructor(
    private readonly favoriteRepository: FavoriteRepository,
    private readonly productService: ProductService,
  ) {}

  async findAll(userId: number): Promise<Product[]> {
    const favorites = await this.favoriteRepository.findAllByUserId(userId);
    const products = favorites.map((f) => f.product).map(toProductMapper);
    return this.productService.populateMainImages(products);
  }

  async toggle(userId: number, productId: number): Promise<{ isFavorite: boolean }> {
    await this.productService.findOne(productId);

    const favorite = await this.favoriteRepository.findOne(userId, productId);

    if (favorite) {
      await this.favoriteRepository.remove(favorite);
      return { isFavorite: false };
    }

    await this.favoriteRepository.create(userId, productId);
    return { isFavorite: true };
  }
}
