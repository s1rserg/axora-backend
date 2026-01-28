import { toProductMapper } from '@modules/product/mappers/to-product.mapper';

import { FavoriteEntity } from '../entities/favorite.entity';

export const toFavoriteProductMapper = (entity: FavoriteEntity) => {
  return toProductMapper(entity.product);
};
