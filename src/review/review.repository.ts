import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateReviewDto } from './dto/createProduct.dto';
import { MyReviewItemList } from './dto/review-Response.dto';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(
    reviewInfo: CreateReviewDto,
    userId: string,
  ): Promise<void> {
    const { score, content, productId, orderItemId } = reviewInfo;

    const newReview = await this.prisma.productReview.create({
      data: {
        userId,
        productId,
        orderItemId,
        score,
        content,
      },
    });
    await Promise.all(
      reviewInfo.url.map((url) =>
        this.prisma.productReviewImage.create({
          data: {
            productReviewId: newReview.id,
            url: url.url,
          },
        }),
      ),
    );
  }

  async getMyReviewList(userId: string): Promise<MyReviewItemList[]> {
    return await this.prisma.productReview.findMany({
      where: { userId },
      select: {
        id: true,
        product: {
          select: {
            name: true,
            price: true,
          },
        },
        orderItem: {
          select: {
            productOptionUnit: {
              select: {
                name: true,
                additionalPrice: true,
              },
            },
            quantity: true,
          },
        },
        score: true,
        content: true,
        updatedAt: true,
      },
    });
  }

  async deleteProductReview(reviewId: number, userId: string): Promise<void> {
    const review = await this.prisma.productReview.findUnique({
      where: {
        id: reviewId,
      },
    });
    if (!review || review.userId !== userId || review.deletedAt !== null)
      throw new NotFoundException('리뷰가 존재하지 않습니다.');

    await this.prisma.productReview.update({
      where: {
        id: review.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
