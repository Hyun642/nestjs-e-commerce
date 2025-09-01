import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

class ProductSummaryDto {
  @ApiProperty({ example: '샴푸' })
  name: string;

  @ApiProperty({ example: 10000 })
  price: number;
}

class ProductOptionUnitSummaryDto {
  @ApiProperty({ example: '500ml' })
  name: string;

  @ApiProperty({ example: 1000 })
  additionalPrice: number;
}

class OrderItemSummaryDto {
  @ApiProperty({ type: ProductSummaryDto })
  product: ProductSummaryDto;

  @ApiProperty({ type: ProductOptionUnitSummaryDto })
  productOptionUnit: ProductOptionUnitSummaryDto;
}

class UserAddressSummaryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '집' })
  name: string;

  @ApiProperty({ example: '서울특별시 강남구 테헤란로 123' })
  address: string;
}

class OrderSummaryItemDto {
  @ApiProperty({ example: 'ord_abc123' })
  id: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.결제완료 })
  orderStatus: OrderStatus;

  @ApiProperty({ example: '2025-02-12T02:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ type: UserAddressSummaryDto })
  userAddress: UserAddressSummaryDto;

  @ApiProperty({ type: [OrderItemSummaryDto] })
  orderItem: OrderItemSummaryDto[];
}

export class OrderListResponseDto {
  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ type: [OrderSummaryItemDto] })
  data: OrderSummaryItemDto[];
}
