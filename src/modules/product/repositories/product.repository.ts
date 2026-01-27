import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { type EntityManager, type FindOptionsWhere, ILike, Repository } from 'typeorm';

import type { Maybe, Nullable } from '@common/types';

import type { Product } from '../types';
import type { CreateProductDto } from '../dto/create-product.dto';
import type { GetAllProductsQueryDto } from '../dto/get-all-products-query.dto';
import { ProductEntity } from '../entities/product.entity';
import { toProductMapper } from '../mappers/to-product.mapper';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDto, manager?: EntityManager): Promise<Product> {
    const repository = this.getRepository(manager);
    const product = repository.create(createProductDto);
    const createdProduct = await repository.save(product);
    return toProductMapper(createdProduct);
  }

  async findAll(query: GetAllProductsQueryDto): Promise<Product[]> {
    const where: FindOptionsWhere<ProductEntity> = {};
    let take: Maybe<number>;
    let skip: Maybe<number>;

    if (query.search) {
      where.title = ILike(`%${query.search}%`);
    }

    if (query.page && query.perPage) {
      take = query.perPage;
      skip = (query.page - 1) * query.perPage;
    }

    const products = await this.productRepository.find({
      where,
      take,
      skip,
      order: { createdAt: 'DESC' },
    });

    return products.map(toProductMapper);
  }

  async findOne(id: number): Promise<Nullable<Product>> {
    const product = await this.productRepository.findOneBy({ id });
    return product ? toProductMapper(product) : null;
  }

  async findOneBySlug(slug: string): Promise<Nullable<Product>> {
    const product = await this.productRepository.findOneBy({ slug });
    return product ? toProductMapper(product) : null;
  }

  private getRepository(manager?: EntityManager) {
    return manager ? manager.getRepository(ProductEntity) : this.productRepository;
  }
}
