import { ApiProperty } from '@nestjs/swagger';
import { ReviewScore } from '@prisma/client';
import { IsDateString, IsInt, IsString } from 'class-validator';

export class ProductReviewEntity {
  @ApiProperty({ description: 'reviewId', example: 'qwe' })
  @IsInt()
  id: number;

  @ApiProperty({ description: 'userId', example: 'qwe' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'productId', example: 'qwe' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'orderId', example: 10 })
  @IsInt()
  orderItemId: number;

  @ApiProperty({ description: 'score', enum: ReviewScore, example: 'FIVE' })
  score: ReviewScore;

  @ApiProperty({ description: 'content', example: 'quick delivery Good!' })
  @IsString()
  content: string;

  @ApiProperty({ description: '생성일시', example: '2025-02-12T02:00:00.000Z' })
  @IsDateString()
  createdAt: Date;
}
