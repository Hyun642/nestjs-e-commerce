import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateShopDto } from './dto/createshop.dto';
import { GetShopListDto } from './dto/getShopList.dto';

@Injectable()
export class ShopRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createShop(shopInfo: CreateShopDto, userId: string): Promise<void> {
    await this.prisma.shop.create({
      data: {
        name: shopInfo.name,
        description: shopInfo.description,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getMyShopList(userId: string): Promise<GetShopListDto[] | null> {
    const shops = await this.prisma.shop.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });
    return shops.map((shop) => ({
      name: shop.name,
      description: shop.description,
      createdAt: shop.createdAt,
    }));
  }
}
