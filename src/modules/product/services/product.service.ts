import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { ProductMediaService } from '@modules/media';

import { FileUpload } from '@common/types';

import { Product } from '../types';
import { CreateProductDto } from '../dto/create-product.dto';
import { GetAllProductsQueryDto } from '../dto/get-all-products-query.dto';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly productMediaService: ProductMediaService,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, files: FileUpload[]): Promise<Product> {
    return this.dataSource.transaction(async (manager) => {
      const product = await this.productRepository.create(createProductDto, manager);

      const images = await this.productMediaService.createImagesForProduct(
        product.id,
        files,
        manager,
      );

      return {
        ...product,
        mainImage: images[0] || null,
        images: images,
      };
    });
  }

  async findAll(query: GetAllProductsQueryDto): Promise<Product[]> {
    const products = await this.productRepository.findAll(query);
    return this.populateMainImages(products);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) throw new NotFoundException(`Product not found`);

    const images = await this.productMediaService.getAllImagesForProduct(id);

    return {
      ...product,
      mainImage: images[0] || null,
      images: images,
    };
  }

  async populateMainImages(products: Product[]): Promise<Product[]> {
    const productIds = products.map((p) => p.id);

    if (!productIds.length) return [];

    const imagesMap = await this.productMediaService.getMainImagesForProducts(productIds);

    return products.map((product) => ({
      ...product,
      mainImage: imagesMap.get(product.id) || null,
      images: [],
    }));
  }
}
