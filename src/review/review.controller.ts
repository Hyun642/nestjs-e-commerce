import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { DefaultResponseDto } from 'src/common/dto/response.dto';
import { CreateReviewDto } from './dto/createReview.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { MyReviewItemList } from './dto/review-Response.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';

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

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('/deleteProductReview/:reviewId')
  async deleteProductReview(
    @Param('reviewId') reviewId: number,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.reviewService.deleteProductReview(reviewId, user.id);
    return {
      message: '[상품 리뷰 정보] 삭제 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('/updateProductReview/:reviewId')
  async updateProductReview(
    @Param('reviewId') reviewId: number,
    @GetUser() user: User,
    @Body() reviewInfo: UpdateReviewDto,
  ): Promise<DefaultResponseDto> {
    await this.reviewService.updateProductReview(reviewInfo, reviewId, user.id);
    return {
      message: '[상품 리뷰 정보] 수정 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }
}
