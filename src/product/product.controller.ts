import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/createProduct.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: HttpStatus.CREATED, description: '상품 등록 성공' })
  @ApiBody({ type: ProductDto })
  @UseGuards(JwtAuthGuard)
  @Post('/createProduct/:shopId')
  async createProduct(
    @Param('shopId') shopId: string,
    @Body() product: ProductDto,
    @GetUser() user: User,
  ) {
    await this.productService.createProduct(shopId, user.id, product);
    return {
      message: '[상품 등록 정보] 등록 성공',
      result: 'success',
      statusCode: HttpStatus.CREATED,
    };
  }

  @ApiResponse({ status: HttpStatus.OK, description: '상품 리스트 조회 성공' })
  @Get('/getProductList/:shopId')
  async getProductList(@Param('shopId') shopId: string) {
    return await this.productService.getProductList(shopId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '상품 상세 조회 성공',
  })
  @Get('/getProductDetail/:productId')
  async getProductDetail(@Param('productId') productId: string) {
    return await this.productService.getProductDetail(productId);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: HttpStatus.OK, description: '상품 삭제 성공' })
  @UseGuards(JwtAuthGuard)
  @Delete('/deleteProduct/:shopId/:productId')
  async deleteProduct(
    @Param('productId') productId: string,
    @Param('shopId') shopId: string,
    @GetUser() user: User,
  ) {
    await this.productService.deleteProduct(productId, shopId, user.id);
    return {
      message: '[상품 등록 정보] 삭제 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }
}
