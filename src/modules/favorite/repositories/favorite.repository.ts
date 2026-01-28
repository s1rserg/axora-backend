import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FavoriteEntity } from '../entities/favorite.entity';

@Injectable()
export class FavoriteRepository {
  constructor(
    @InjectRepository(FavoriteEntity)
    private readonly favoriteRepository: Repository<FavoriteEntity>,
  ) {}

  async findAllByUserId(userId: number): Promise<FavoriteEntity[]> {
    return this.favoriteRepository.find({
      where: { userId },
      relations: ['product'],
    });
  }

  async findOne(userId: number, productId: number): Promise<FavoriteEntity | null> {
    return this.favoriteRepository.findOneBy({
      userId,
      productId,
    });
  }

  async create(userId: number, productId: number): Promise<FavoriteEntity> {
    const favorite = this.favoriteRepository.create({
      userId,
      productId,
    });
    return this.favoriteRepository.save(favorite);
  }

  async remove(favorite: FavoriteEntity): Promise<void> {
    await this.favoriteRepository.remove(favorite);
  }
}
