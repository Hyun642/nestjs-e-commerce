import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}
  async createProduct(shopId: string, userId: string, product: ProductDto) {
    await this.productRepository.createProduct(shopId, userId, product);
  }

  async getProductList(shopId: string) {
    return await this.productRepository.getProductList(shopId);
  }

  async getProductDetail(productId: string) {
    return await this.productRepository.getProductDetail(productId);
  }

  async deleteProduct(productId: string, shopId: string, userId: string) {
    return await this.productRepository.deleteProduct(
      productId,
      shopId,
      userId,
    );
  }
}
