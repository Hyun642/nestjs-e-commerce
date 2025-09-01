import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { MyReviewItemListDto } from './dto/review-Response.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(
    reviewInfo: CreateReviewDto,
    userId: string,
  ): Promise<void> {
    const { score, content, productId, orderItemId } = reviewInfo;

    await this.prisma.$transaction(async (tx) => {
      const newReview = await tx.productReview.create({
        data: {
          userId,
          productId,
          orderItemId,
          score,
          content,
        },
      });
      if (reviewInfo.url.length > 0) {
        await tx.productReviewImage.createMany({
          data: reviewInfo.url.map(({ url }) => ({
            productReviewId: newReview.id,
            url: url,
          })),
        });
      }
    });
  }

  async getMyReviewList(userId: string): Promise<MyReviewItemListDto[]> {
    return this.prisma.productReview.findMany({
      where: { userId, deletedAt: null },
      select: {
        id: true,
        score: true,
        content: true,
        updatedAt: true,
        product: {
          select: {
            name: true,
            price: true,
          },
        },
        orderItem: {
          select: {
            quantity: true,
            productOptionUnit: {
              select: {
                name: true,
                additionalPrice: true,
              },
            },
          },
        },

        productReviewImage: {
          where: {
            deletedAt: null,
          },
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async deleteProductReview(reviewId: number, userId: string): Promise<void> {
    const result = await this.prisma.productReview.updateMany({
      where: {
        id: reviewId,
        userId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    if (result.count == 0) {
      throw new NotFoundException('리뷰가 존재하지 않습니다.');
    }
  }

  async updateProductReview(
    reviewInfo: UpdateReviewDto,
    reviewId: number,
    userId: string,
  ): Promise<void> {
    const { score, content, url } = reviewInfo;

    await this.prisma.$transaction(async (tx) => {
      const review = await tx.productReview.findUnique({
        where: {
          id: reviewId,
        },
      });

      if (!review || review.userId !== userId || review.deletedAt !== null)
        throw new NotFoundException('리뷰가 존재하지 않습니다.');

      await tx.productReview.update({
        where: { id: review.id },
        data: {
          score,
          content,
        },
      }),
        await tx.productReviewImage.updateMany({
          where: { productReviewId: reviewId },
          data: {
            deletedAt: new Date(),
          },
        });

      if (url.length > 0) {
        await tx.productReviewImage.createMany({
          data: url.map(({ url }) => ({
            productReviewId: reviewId,
            url,
          })),
        });
      }
    });
  }
}
