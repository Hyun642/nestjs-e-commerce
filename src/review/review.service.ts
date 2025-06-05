import { Injectable } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { CreateReviewDto } from './dto/createReview.dto';
import { MyReviewItemListDto } from './dto/review-Response.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(
    reviewInfo: CreateReviewDto,
    userId: string,
  ): Promise<void> {
    await this.reviewRepository.createReview(reviewInfo, userId);
  }

  async getMyReviewList(userId: string): Promise<MyReviewItemListDto[]> {
    return await this.reviewRepository.getMyReviewList(userId);
  }

  async deleteProductReview(reviewId: number, userId: string): Promise<void> {
    await this.reviewRepository.deleteProductReview(reviewId, userId);
  }

  async updateProductReview(
    reviewInfo: UpdateReviewDto,
    reviewId: number,
    userId: string,
  ): Promise<void> {
    await this.reviewRepository.updateProductReview(
      reviewInfo,
      reviewId,
      userId,
    );
  }
}
