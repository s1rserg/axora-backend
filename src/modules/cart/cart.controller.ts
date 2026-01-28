import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TransformPlainToInstance } from 'class-transformer';

import { ActiveUser } from '@common/types';
import { CartItemResponseDto } from '@common/dto/cart/cart-item-response.dto';
import { RequestUser } from '@common/decorators/active-user.decorator';

import { CartItem } from './types';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './services/cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @TransformPlainToInstance(CartItemResponseDto)
  async findAll(@RequestUser() user: ActiveUser): Promise<CartItem[]> {
    return this.cartService.findAll(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @TransformPlainToInstance(CartItemResponseDto)
  async addToCart(
    @RequestUser() user: ActiveUser,
    @Body() createDto: CreateCartItemDto,
  ): Promise<CartItem> {
    return this.cartService.addToCart(user.id, createDto);
  }

  @Patch(':itemId')
  @TransformPlainToInstance(CartItemResponseDto)
  async updateQuantity(
    @RequestUser() user: ActiveUser,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    return this.cartService.updateQuantity(user.id, itemId, updateDto);
  }

  @Delete(':itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeItem(@RequestUser() user: ActiveUser, @Param('itemId', ParseIntPipe) itemId: number) {
    await this.cartService.removeItem(user.id, itemId);
  }
}
