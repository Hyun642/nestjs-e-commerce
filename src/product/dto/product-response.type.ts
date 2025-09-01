// product-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  shopId: string;

  @ApiProperty()
  thumbnailImageUrl: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;
}

export class ProductReviewCount {
  @ApiProperty()
  productReview: number;
}

export class ProductImageDto {
  @ApiProperty()
  url: string;
}

export class ProductOptionUnitDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  additionalPrice: number;
}

export class ProductOptionDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  isRequired: boolean;

  @ApiProperty({ type: [ProductOptionUnitDto] })
  productOptionUnit: ProductOptionUnitDto[];
}

export class ProductDetailResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  shopId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  thumbnailImageUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: ProductReviewCount })
  _count: ProductReviewCount;

  @ApiProperty({ type: [ProductImageDto] })
  productImage: ProductImageDto[];

  @ApiProperty({ type: [ProductOptionDto] })
  productOption: ProductOptionDto[];
}

export class SearchProductDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty({ type: [ProductDto] })
  data: ProductDto[];
}
