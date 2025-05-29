import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/createProduct.dto';
import { MyReviewItemList } from './dto/review-Response.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(
    reviewInfo: CreateReviewDto,
    userId: string,
  ): Promise<void> {
    await this.reviewRepository.createReview(reviewInfo, userId);
  }

  async getMyReviewList(userId: string): Promise<MyReviewItemList[]> {
    return await this.reviewRepository.getMyReviewList(userId);
  }
}
