import type { ProductMedia } from '../types';
import { toMediaMapper } from './to-media-mapper';

export const toProductMediaMapper = <T extends ProductMedia>(
  productMediaLike: T,
): ProductMedia => ({
  id: productMediaLike.id,
  isMain: productMediaLike.isMain,
  productId: productMediaLike.productId,
  mediaId: productMediaLike.mediaId,
  media: productMediaLike.media && toMediaMapper(productMediaLike.media),
  createdAt: productMediaLike.createdAt,
  updatedAt: productMediaLike.updatedAt,
});
