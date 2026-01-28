import { Product } from '../../product/types';

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: Product;
}
