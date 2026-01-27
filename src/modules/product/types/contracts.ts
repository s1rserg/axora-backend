import { Media } from '@modules/media';

import type { Nullable } from '@common/types';

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: Nullable<string>;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  mainImage: Nullable<Media>;
  images?: Media[];
}
