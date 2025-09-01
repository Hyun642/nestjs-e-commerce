import { ApiProperty, PickType } from '@nestjs/swagger';
import { ProductReviewEntity } from '../entity/productReview.entity';
import { productReviewImageEntity } from '../entity/productReviewImage.entity';

class CreateReviewImageDto extends PickType(productReviewImageEntity, [
  'url',
]) {}

export class CreateReviewDto extends PickType(ProductReviewEntity, [
  'productId',
  'orderItemId',
  'score',
  'content',
]) {
  @ApiProperty({
    type: [CreateReviewImageDto],
    description: '리뷰 이미지 url',
    example: [{ url: 'www.qwe.com' }],
  })
  url: CreateReviewImageDto[];
}
