import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';

import { Media } from '../types';
import { ProductMediaEntity } from '../entities/product-media.entity';
import { toMediaMapper } from '../mappers/to-media-mapper';

@Injectable()
export class ProductMediaRepository {
  constructor(
    @InjectRepository(ProductMediaEntity)
    private readonly repo: Repository<ProductMediaEntity>,
  ) {}

  async createMany(
    data: { productId: number; mediaId: number; isMain: boolean }[],
    manager: EntityManager,
  ): Promise<void> {
    const repo = manager.getRepository(ProductMediaEntity);
    await repo.save(repo.create(data));
  }

  async findMainImagesByProductIds(productIds: number[]): Promise<Map<number, Media>> {
    const records = await this.repo.find({
      where: { productId: In(productIds), isMain: true },
      relations: { media: true },
    });

    const map = new Map<number, Media>();
    records.forEach((r) => {
      if (r.media) map.set(r.productId, toMediaMapper(r.media));
    });
    return map;
  }

  async findAllByProductId(productId: number): Promise<Media[]> {
    const records = await this.repo.find({
      where: { productId },
      relations: { media: true },
      order: { isMain: 'DESC', createdAt: 'DESC' },
    });
    return records.filter((r) => r.media).map((r) => toMediaMapper(r.media));
  }
}
