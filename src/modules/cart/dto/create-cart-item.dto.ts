import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';

export class CreateCartItemDto {
  @ApiProperty({ description: 'ID of the product to add to cart' })
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ description: 'Quantity of the product', default: 1, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number = 1;
}
