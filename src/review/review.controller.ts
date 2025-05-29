import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { DefaultResponseDto } from 'src/common/dto/response.dto';
import { CreateReviewDto } from './dto/createProduct.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { MyReviewItemList } from './dto/review-Response.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createReview(
    @Body() reviewInfo: CreateReviewDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.reviewService.createReview(reviewInfo, user.id);
    return {
      message: '[리뷰] 리뷰 등록 성공',
      result: 'success',
      statusCode: HttpStatus.CREATED,
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/getMyReviewList')
  async getMyReviewList(@GetUser() user: User): Promise<MyReviewItemList[]> {
    return await this.reviewService.getMyReviewList(user.id);
  }
}
