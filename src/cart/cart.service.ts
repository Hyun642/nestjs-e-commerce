import { Injectable } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { AddCartItem } from './dto/addCartIem.dto';
import { CartItemWithOptionUnits } from './dto/cartItem.type';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async addCartItem(itemInfo: AddCartItem, userId: string): Promise<void> {
    await this.cartRepository.addCartItem(itemInfo, userId);
  }

  async getMyCartItems(userId: string): Promise<CartItemWithOptionUnits[]> {
    return await this.cartRepository.getMyCartItems(userId);
  }
}
