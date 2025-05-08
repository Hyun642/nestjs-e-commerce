import {
  Body,
  Controller,
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

  @Get('/getProductList/:shopId')
  async getProductList(@Param('shopId') shopId: string) {
    return await this.productService.getProductList(shopId);
  }
}
