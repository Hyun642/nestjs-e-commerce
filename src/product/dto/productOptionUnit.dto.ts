import { PickType } from '@nestjs/swagger';
import { ProductOptionUnitEntity } from '../entity/productOptionUnit.entity';

export class ProductOptionUnitDto extends PickType(ProductOptionUnitEntity, [
  'name',
  'stock',
  'additionalPrice',
]) {}
