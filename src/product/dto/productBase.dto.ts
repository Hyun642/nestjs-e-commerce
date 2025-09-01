import { PickType } from '@nestjs/swagger';
import { ProductEntity } from '../entity/product.entity';

export class ProductBaseDto extends PickType(ProductEntity, [
  'name',
  'description',
  'price',
  'thumbnailImageUrl',
]) {}
