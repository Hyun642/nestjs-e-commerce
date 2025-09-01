import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductDto } from './dto/createProduct.dto';
import {
  ProductDetailResponseDto,
  SearchProductDto,
} from './dto/product-response.type';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(
    shopId: string,
    userId: string,
    product: ProductDto,
  ): Promise<void> {
    await this.productRepository.createProduct(shopId, userId, product);
  }

  async getProductDetail(productId: string): Promise<ProductDetailResponseDto> {
    return await this.productRepository.getProductDetail(productId);
  }

  async deleteProduct(
    productId: string,
    shopId: string,
    userId: string,
  ): Promise<void> {
    return await this.productRepository.deleteProduct(
      productId,
      shopId,
      userId,
    );
  }

  async updateProduct(
    productId: string,
    shopId: string,
    userId: string,
    product: ProductDto,
  ): Promise<void> {
    return await this.productRepository.updateProduct(
      productId,
      shopId,
      userId,
      product,
    );
  }

  async searchProduct(query: any): Promise<SearchProductDto> {
    return await this.productRepository.searchProduct(query);
  }

  async searchProductInShop(
    query: any,
    shopId: string,
  ): Promise<SearchProductDto> {
    return await this.productRepository.searchProductInShop(query, shopId);
  }
}
