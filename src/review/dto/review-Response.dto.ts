import { ReviewScore } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProductInfoDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;
}

export class ProductOptionUnitDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  additionalPrice: number;
}

export class OrderItemDto {
  @ApiProperty({ type: ProductOptionUnitDto })
  productOptionUnit: ProductOptionUnitDto;

  @ApiProperty()
  quantity: number;
}

export class MyReviewItemListDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: ProductInfoDto })
  product: ProductInfoDto;

  @ApiProperty({ type: OrderItemDto })
  orderItem: OrderItemDto;

  @ApiProperty({ enum: ReviewScore })
  score: ReviewScore;

  @ApiProperty()
  content: string;

  @ApiProperty()
  updatedAt: Date;
}
