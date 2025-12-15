import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import type { Nullable } from '@common/types';

import { ProductMediaResponseDto } from './product-media-response.dto';

@Exclude()
export class ProductResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  title: string;

  @Expose()
  @ApiProperty()
  slug: string;

  @Expose()
  @ApiProperty({ nullable: true })
  description: Nullable<string>;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiProperty()
  stock: number;

  @Expose()
  @ApiProperty()
  isActive: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty({ type: ProductMediaResponseDto, nullable: true })
  mainImage?: Nullable<ProductMediaResponseDto>;
}
