import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { AddCartItem } from './dto/addCartIem.dto';
import { CartItemWithOptionUnitsDto } from './dto/cartItem.type';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async addCartItem(itemInfo: AddCartItem, userId: string): Promise<void> {
    await this.cartRepository.addCartItem(itemInfo, userId);
  }

  async getMyCartItems(userId: string): Promise<CartItemWithOptionUnitsDto[]> {
    return await this.cartRepository.getMyCartItems(userId);
  }

  async deleteCartItem(cartItemId: number, userId: string): Promise<void> {
    return await this.cartRepository.deleteCartItem(cartItemId, userId);
  }

  async updateCartItem(
    cartItemId: number,
    itemInfo: AddCartItem,
    userId: string,
  ): Promise<void> {
    await this.cartRepository.updateCartItem(cartItemId, itemInfo, userId);
  }
}
