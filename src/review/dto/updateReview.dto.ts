import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProductReviewEntity } from '../entity/productReview.entity';
import { productReviewImageEntity } from '../entity/productReviewImage.entity';

class ProductReviewImageDto extends PickType(productReviewImageEntity, [
  'url',
]) {}

export class UpdateReviewDto extends PickType(ProductReviewEntity, [
  'score',
  'content',
]) {
  @ApiProperty({
    type: [ProductReviewImageDto],
    description: '리뷰 이미지 url',
    example: [{ url: 'www.qwe.com' }],
    isArray: true,
  })
  url: ProductReviewImageDto[];
}
