import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { AddCartItem } from './dto/addCartIem.dto';
import { CartItemWithOptionUnits } from './dto/cartItem.type';

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

  async getMyCartItems(userId: string): Promise<CartItemWithOptionUnits[]> {
    return await this.prisma.cartItem.findMany({
      where: { userId: userId, deletedAt: null },
      include: {
        product: {
          select: {
            price: true,
          },
        },
        cartItemOptionUnit: {
          select: {
            productionOptionUnit: {
              select: {
                id: true,
                name: true,
                additionalPrice: true,
              },
            },
          },
        },
      },
    });
  }

  async deleteCartItem(cartItemId: number, userId: string): Promise<void> {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId, userId: userId, deletedAt: null },
    });

    if (!item || item.userId !== userId || item.deletedAt !== null) {
      throw new NotFoundException(
        '해당 아이템에 대한 권한이 없거나 이미 삭제 되었습니다.',
      );
    }

    await this.prisma.cartItem.updateMany({
      where: { id: cartItemId, userId: userId, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
