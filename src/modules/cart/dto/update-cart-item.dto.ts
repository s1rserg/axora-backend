import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ description: 'New quantity of the cart item' })
  @IsInt()
  @Min(1)
  quantity: number;
}
