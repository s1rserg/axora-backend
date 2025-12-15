import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { FileUpload } from '@common/types';

import { Media } from '../types';
import { CloudinaryService } from './cloudinary.service';
import { MediaRepository } from '../repositories/media.repository';
import { ProductMediaRepository } from '../repositories/product-media.repository';

@Injectable()
export class ProductMediaService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly mediaRepository: MediaRepository,
    private readonly productMediaRepository: ProductMediaRepository,
  ) {}

  async createImagesForProduct(
    productId: number,
    files: FileUpload[],
    manager: EntityManager,
  ): Promise<Media[]> {
    if (!files.length) return [];

    const uploadResults = await Promise.all(
      files.map(async (file) => this.cloudinaryService.upload(file, 'products')),
    );

    const medias = await Promise.all(
      uploadResults.map(async (res) => this.mediaRepository.create(res, manager)),
    );

    const productMediaData = medias.map((media, index) => ({
      productId,
      mediaId: media.id,
      isMain: index === 0,
    }));

    await this.productMediaRepository.createMany(productMediaData, manager);

    return medias;
  }

  async getMainImagesForProducts(productIds: number[]): Promise<Map<number, Media>> {
    return this.productMediaRepository.findMainImagesByProductIds(productIds);
  }

  async getAllImagesForProduct(productId: number): Promise<Media[]> {
    return this.productMediaRepository.findAllByProductId(productId);
  }
}
