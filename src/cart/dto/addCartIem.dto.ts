import { ApiProperty, PickType } from '@nestjs/swagger';
import { CartEntity } from '../entity/cart.entity';
import { IsArray, IsNotEmpty } from 'class-validator';

export class AddCartItem extends PickType(CartEntity, [
  'productId',
  'quantity',
]) {
  @ApiProperty({ description: 'product 옵션 ID', example: '1' })
  @IsArray()
  @IsNotEmpty()
  productOptionUnitId: number[];
}
