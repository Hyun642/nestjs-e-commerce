import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { AddCartItem } from './dto/addCartIem.dto';
import { CartItemWithOptionUnitsDto } from './dto/cartItem.type';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}
  async addCartItem(itemInfo: AddCartItem, userId: string): Promise<void> {
    const { productId, quantity, productOptionUnitId } = itemInfo;

    await this.prisma.$transaction(async (tx) => {
      const newCartItem = await tx.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });

      await tx.cartItemOptionUnit.createMany({
        data: productOptionUnitId.map((id) => ({
          cartItemId: newCartItem.id,
          productOptionUnitId: id,
        })),
      });
    });
  }

  async getMyCartItems(userId: string): Promise<CartItemWithOptionUnitsDto[]> {
    return this.prisma.cartItem.findMany({
      where: { userId, deletedAt: null },
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
    const deleted = await this.prisma.cartItem.updateMany({
      where: { id: cartItemId, userId: userId, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundException(
        '해당 아이템에 대한 권한이 없거나 이미 삭제 되었습니다.',
      );
    }
  }

  async updateCartItem(
    cartItemId: number,
    itemInfo: AddCartItem,
    userId: string,
  ): Promise<void> {
    const { quantity, productId } = itemInfo;
    const productOptionUnitId = [...new Set(itemInfo.productOptionUnitId)];

    const cartItem = await this.prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: {
        userId: true,
        deletedAt: true,
      },
    });

    if (
      !cartItem ||
      cartItem.userId !== userId ||
      cartItem.deletedAt !== null
    ) {
      throw new NotFoundException(
        '해당 아이템에 대한 권한이 없거나 삭제 혹은 존재하지 않습니다.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.cartItemOptionUnit.deleteMany({
        where: { cartItemId },
      });

      await tx.cartItem.update({
        where: { id: cartItemId },
        data: {
          productId,
          quantity,
        },
      });

      await tx.cartItemOptionUnit.createMany({
        data: productOptionUnitId.map((id) => ({
          cartItemId,
          productOptionUnitId: id,
        })),
      });
    });
  }
}
