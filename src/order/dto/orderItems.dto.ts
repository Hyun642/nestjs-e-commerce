import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderEntity } from './\bentity/order.entity';
import { OrderItemEntity } from './\bentity/orderItem.entity';

class BaseOrderDto extends PickType(OrderEntity, ['orderStatus']) {}
class OrderItemsDto extends PickType(OrderItemEntity, [
  'productId',
  'productOptionUnitId',
  'quantity',
]) {}

export class OrderDto extends BaseOrderDto {
  @ApiProperty({
    type: [OrderItemsDto],
    description: '주문 항목 리스트',
    example: [
      {
        productId: 'abc123',
        productOptionUnitId: 2,
        quantity: 3,
      },
    ],
  })
  orderItems: OrderItemsDto[];
}
