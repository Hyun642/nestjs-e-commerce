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
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { MyReviewItemListDto } from './dto/review-Response.dto';
import { UpdateReviewDto } from './dto/updateReview.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '리뷰 등록 성공',
    type: DefaultResponseDto,
  })
  @ApiBody({ type: CreateReviewDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/')
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

  @ApiResponse({
    status: 200,
    description: '리뷰 리스트 반환',
    type: MyReviewItemListDto,
    isArray: true,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getMyReviewList(@GetUser() user: User): Promise<MyReviewItemListDto[]> {
    return await this.reviewService.getMyReviewList(user.id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '리뷰 삭제 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '리뷰가 존재하지 않습니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('/:reviewId')
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

  @ApiResponse({
    status: HttpStatus.OK,
    description: '리뷰 업데이트 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '리뷰가 존재하지 않습니다.',
  })
  @ApiBody({ type: UpdateReviewDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('/:reviewId')
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
