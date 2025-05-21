import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { AddCartItem } from './dto/addCartIem.dto';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}
  async addCartItem(itemInfo: AddCartItem, userId: string): Promise<void> {
    const { productId, quantity, productOptionUnitId } = itemInfo;

    const newCartItem = await this.prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity,
      },
    });
    await Promise.all(
      productOptionUnitId.map((id) =>
        this.prisma.cartItemOptionUnit.create({
          data: {
            cartItemId: newCartItem.id,
            productOptionUnitId: id,
          },
        }),
      ),
    );
  }
}
