import { Injectable } from '@nestjs/common';
import { ShopRepository } from './shop.repository';
import { CreateShopDto } from './dto/entity/createshop.dto';

@Injectable()
export class ShopService {
  constructor(private readonly shopRepository: ShopRepository) {}
  async createShop(shopInfo: CreateShopDto, userId: string): Promise<void> {
    return await this.shopRepository.createShop(shopInfo, userId);
  }
}
