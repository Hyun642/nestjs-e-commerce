import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateShopDto } from './dto/entity/createshop.dto';

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
}
