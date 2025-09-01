import { PickType } from '@nestjs/swagger';
import { productImageEntity } from '../entity/productImage.entity';

export class productImageDto extends PickType(productImageEntity, ['url']) {}
