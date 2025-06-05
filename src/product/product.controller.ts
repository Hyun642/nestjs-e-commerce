import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/createProduct.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { DefaultResponseDto } from 'src/common/dto/response.dto';
import {
  ProductDetailResponseDto,
  SearchProductDto,
} from './dto/product-response.type';
import { SearchDto } from 'src/common/dto/search.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '상품 등록 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 상점에 대한 권한이 없거나 존재하지 않습니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: ProductDto })
  @UseGuards(JwtAuthGuard)
  @Post('/:shopId')
  async createProduct(
    @Param('shopId') shopId: string,
    @Body() product: ProductDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.productService.createProduct(shopId, user.id, product);
    return {
      message: '[상품 등록 정보] 등록 성공',
      result: 'success',
      statusCode: HttpStatus.CREATED,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '상품 상세 조회 성공',
    type: ProductDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 상품이 존재하지 않습니다.',
  })
  @Get('/:productId')
  async getProductDetail(
    @Param('productId') productId: string,
  ): Promise<ProductDetailResponseDto> {
    return await this.productService.getProductDetail(productId);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '상품 삭제 성공',
    type: ProductDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 상점에 대한 권한이 없거나 존재하지 않습니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('/:shopId/products/:productId')
  async deleteProduct(
    @Param('productId') productId: string,
    @Param('shopId') shopId: string,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.productService.deleteProduct(productId, shopId, user.id);
    return {
      message: '[상품 등록 정보] 삭제 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '상품 수정 성공',
    type: ProductDetailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 상점에 대한 권한이 없거나 상품이 존재하지 않습니다.',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: ProductDto })
  @UseGuards(JwtAuthGuard)
  @Patch('/:shopId/products/:productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Param('shopId') shopId: string,
    @Body() product: ProductDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.productService.updateProduct(
      productId,
      shopId,
      user.id,
      product,
    );
    return {
      message: '[상품 등록 정보] 수정 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '상품 검색 성공',
    type: SearchProductDto,
  })
  @Get('/search')
  async searchProduct(@Query() query: SearchDto): Promise<SearchProductDto> {
    return await this.productService.searchProduct(query);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '상품 검색 성공',
    type: SearchProductDto,
  })
  @Get('/search/:shopId')
  async searchProductInShop(
    @Query() query: SearchDto,
    @Param('shopId') shopId: string,
  ): Promise<SearchProductDto> {
    return await this.productService.searchProductInShop(query, shopId);
  }
}
