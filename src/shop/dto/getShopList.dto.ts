import { PickType } from '@nestjs/swagger';
import { ShopEntity } from './entity/shop.entity';

export class GetShopListDto extends PickType(ShopEntity, [
  'name',
  'description',
  'createdAt',
]) {}
