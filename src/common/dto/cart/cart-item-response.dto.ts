import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { ProductResponseDto } from '../product/product-response.dto';

@Exclude()
export class CartItemResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  productId: number;

  @Expose()
  @ApiProperty()
  quantity: number;

  @Expose()
  @ApiProperty({ type: ProductResponseDto })
  @Type(() => ProductResponseDto)
  product: ProductResponseDto;
}
