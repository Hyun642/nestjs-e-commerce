import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateShopDto } from './dto/createshop.dto';
import { GetShopInfoDto } from './dto/getShopInfo.dto';
import { SearchShopDto } from './dto/searchShop.dto';

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

  async getMyShopList(userId: string): Promise<GetShopInfoDto[] | null> {
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

  async getShopById(shopId: string): Promise<GetShopInfoDto | null> {
    const shop = await this.prisma.shop.findFirst({
      where: {
        id: shopId,
        deletedAt: null,
      },
    });
    if (!shop) throw new NotFoundException('상점이 존재하지 않습니다.');

    return {
      name: shop.name,
      description: shop.description,
      createdAt: shop.createdAt,
    };
  }

  async updateMyShopById(
    shopId: string,
    userId: string,
    body: CreateShopDto,
  ): Promise<void> {
    const shop = await this.prisma.shop.findFirst({
      where: {
        id: shopId,
        userId: userId,
        deletedAt: null,
      },
    });
    if (!shop) throw new NotFoundException('상점이 존재하지 않습니다.');

    await this.prisma.shop.updateMany({
      where: shop,
      data: {
        name: body.name,
        description: body.description,
      },
    });
  }

  async deleteMyShopById(shopId: string, userId: string): Promise<void> {
    const shop = await this.prisma.shop.findFirst({
      where: {
        id: shopId,
        userId: userId,
        deletedAt: null,
      },
    });
    if (!shop) throw new NotFoundException('상점이 존재하지 않습니다.');

    await this.prisma.shop.updateMany({
      where: shop,
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async searchShop(query: SearchShopDto): Promise<any> {
    const { keyword, page, limit, order } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(keyword && {
        name: {
          contains: keyword,
        },
      }),
      deletedAt: null,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.shop.findMany({
        where: where,
        orderBy: {
          createdAt: order,
        },
        skip,
        take: limit,
      }),
      this.prisma.shop.count({ where: where }),
    ]);
    return {
      total,
      page,
      limit,
      data,
    };
  }
}
