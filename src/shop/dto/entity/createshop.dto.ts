import { PickType } from '@nestjs/swagger';
import { ShopEntity } from './shop.entity';

export class CreateShopDto extends PickType(ShopEntity, [
  'name',
  'description',
]) {}
