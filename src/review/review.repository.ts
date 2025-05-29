import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateReviewDto } from './dto/createProduct.dto';

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
}
