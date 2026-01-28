import { Injectable, NotFoundException } from '@nestjs/common';

import { CartItem } from '../types';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { ProductService } from '../../product/services/product.service';
import { CartRepository } from '../repositories/cart.repository';
import { toProductMapper } from '../../product/mappers/to-product.mapper';
import { toCartItemMapper } from '../mappers/to-cart-item.mapper';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productService: ProductService,
  ) {}

  async findAll(userId: number): Promise<CartItem[]> {
    const items = await this.cartRepository.findAllByUserId(userId);
    const products = items.map((i) => toProductMapper(i.product));
    const enrichedProducts = await this.productService.populateMainImages(products);

    return items.map((item, index) => ({
      ...toCartItemMapper(item),
      product: enrichedProducts[index]!,
    }));
  }

  async addToCart(userId: number, createDto: CreateCartItemDto): Promise<CartItem> {
    const productId = createDto.productId;
    const quantity = createDto.quantity ?? 1;

    await this.productService.findOne(productId);

    const cartItem = await this.cartRepository.findOne(userId, productId);

    let savedItem;
    if (cartItem) {
      cartItem.quantity += quantity;
      savedItem = await this.cartRepository.save(cartItem);
    } else {
      savedItem = await this.cartRepository.create(userId, productId, quantity);
    }

    const products = [toProductMapper(savedItem.product)];
    const enrichedProducts = await this.productService.populateMainImages(products);

    return {
      ...toCartItemMapper(savedItem),
      product: enrichedProducts[0]!,
    };
  }

  async updateQuantity(
    userId: number,
    itemId: number,
    updateDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cartItem = await this.cartRepository.findByIdAndUser(itemId, userId);

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    cartItem.quantity = updateDto.quantity;
    const savedItem = await this.cartRepository.save(cartItem);

    const products = [toProductMapper(savedItem.product)];
    const enrichedProducts = await this.productService.populateMainImages(products);

    return {
      ...toCartItemMapper(savedItem),
      product: enrichedProducts[0]!,
    };
  }

  async removeItem(userId: number, itemId: number): Promise<void> {
    const removed = await this.cartRepository.remove(itemId, userId);
    if (!removed) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }
  }
}
