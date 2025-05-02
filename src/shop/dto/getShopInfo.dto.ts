import { PickType } from '@nestjs/swagger';
import { ShopEntity } from './entity/shop.entity';

export class GetShopInfoDto extends PickType(ShopEntity, [
  'name',
  'description',
  'createdAt',
]) {}
