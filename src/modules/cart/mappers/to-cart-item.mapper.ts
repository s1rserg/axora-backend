import { toProductMapper } from '@modules/product/mappers/to-product.mapper';

import { CartItemEntity } from '../entities/cart-item.entity';

export const toCartItemMapper = (entity: CartItemEntity) => ({
  id: entity.id,
  productId: entity.productId,
  quantity: entity.quantity,
  product: toProductMapper(entity.product),
});
