import { PickType } from '@nestjs/swagger';
import { ShopEntity } from '../entity/shop.entity';

export class CreateShopDto extends PickType(ShopEntity, [
  'name',
  'description',
]) {}
