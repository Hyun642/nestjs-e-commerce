import { Injectable } from '@nestjs/common';
import { ShopRepository } from './shop.repository';
import { CreateShopDto } from './dto/createshop.dto';
import { GetShopInfoDto } from './dto/getShopInfo.dto';

@Injectable()
export class ShopService {
  constructor(private readonly shopRepository: ShopRepository) {}
  async createShop(shopInfo: CreateShopDto, userId: string): Promise<void> {
    return await this.shopRepository.createShop(shopInfo, userId);
  }

  async getMyShopList(userId: string): Promise<GetShopInfoDto[] | null> {
    return await this.shopRepository.getMyShopList(userId);
  }

  async getShopById(shopId: string): Promise<GetShopInfoDto | null> {
    return await this.shopRepository.getShopById(shopId);
  }

  async updateMyShopById(
    shopId: string,
    userId: string,
    body: CreateShopDto,
  ): Promise<void> {
    await this.shopRepository.updateMyShopById(shopId, userId, body);
  }

  async deleteMyShopById(shopId: string, userId: string): Promise<void> {
    await this.shopRepository.deleteMyShopById(shopId, userId);
  }
}
