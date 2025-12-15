import { Product } from '../types';
import { ProductEntity } from '../entities/product.entity';

export const toProductMapper = (entity: ProductEntity): Product => ({
  id: entity.id,
  title: entity.title,
  slug: entity.slug,
  description: entity.description,
  price: Number(entity.price),
  stock: entity.stock,
  isActive: entity.isActive,
  createdAt: entity.createdAt,
  updatedAt: entity.updatedAt,
  mainImage: null,
  images: [],
});
