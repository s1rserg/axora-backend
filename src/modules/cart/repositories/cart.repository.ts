import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Nullable } from '@common/types';

import { CartItemEntity } from '../entities/cart-item.entity';

@Injectable()
export class CartRepository {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartRepository: Repository<CartItemEntity>,
  ) {}

  async findAllByUserId(userId: number): Promise<CartItemEntity[]> {
    return this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async findOne(userId: number, productId: number): Promise<Nullable<CartItemEntity>> {
    return this.cartRepository.findOne({
      where: { userId, productId },
      relations: ['product'],
    });
  }

  async findByIdAndUser(id: number, userId: number): Promise<Nullable<CartItemEntity>> {
    return this.cartRepository.findOne({
      where: { id, userId },
      relations: ['product'],
    });
  }

  async create(userId: number, productId: number, quantity: number): Promise<CartItemEntity> {
    const cartItem = this.cartRepository.create({
      userId,
      productId,
      quantity,
    });
    const saved = await this.cartRepository.save(cartItem);
    return this.findByIdAndUser(saved.id, userId) as Promise<CartItemEntity>;
  }

  async save(cartItem: CartItemEntity): Promise<CartItemEntity> {
    const saved = await this.cartRepository.save(cartItem);
    return this.findByIdAndUser(saved.id, saved.userId) as Promise<CartItemEntity>;
  }

  async remove(id: number, userId: number): Promise<boolean> {
    const result = await this.cartRepository.delete({ id, userId });
    return result.affected !== 0;
  }
}
