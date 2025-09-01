import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { ProductDto } from './dto/createProduct.dto';
import {
  ProductDetailResponseDto,
  SearchProductDto,
} from './dto/product-response.type';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    shopId: string,
    userId: string,
    product: ProductDto,
  ): Promise<void> {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
    });
    if (!shop || shop.userId !== userId || shop.deletedAt !== null) {
      throw new NotFoundException(
        '해당 상점에 대한 권한이 없거나 존재하지 않습니다.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      const createdProduct = await tx.product.create({
        data: {
          name: product.name,
          price: product.price,
          thumbnailImageUrl: product.thumbnailImageUrl,
          description: product.description,
          shop: {
            connect: { id: shopId },
          },
        },
      });

      const productId = createdProduct.id;

      if (product.image.length > 0) {
        await tx.productImage.createMany({
          data: product.image.map((img) => ({
            url: img.url,
            productId,
          })),
        });
      }

      for (const option of product.option) {
        const { id: optionId } = await tx.productOption.create({
          data: {
            name: option.name,
            stock: option.stock,
            isRequired: option.isRequired,
            productId,
          },
          select: {
            id: true,
          },
        });

        await tx.productOptionUnit.createMany({
          data: option.units.map((unit) => ({
            name: unit.name,
            stock: unit.stock,
            additionalPrice: unit.additionalPrice,
            productOptionId: optionId,
          })),
        });
      }
    });
  }

  async getProductDetail(productId: string): Promise<ProductDetailResponseDto> {
    const productInfo = await this.prisma.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
      select: {
        id: true,
        shopId: true,
        name: true,
        price: true,
        description: true,
        thumbnailImageUrl: true,
        createdAt: true,
        _count: {
          select: {
            productReview: true,
          },
        },
        productImage: {
          select: {
            url: true,
          },
        },
        productOption: {
          select: {
            id: true,
            name: true,
            stock: true,
            isRequired: true,
            productOptionUnit: {
              select: {
                id: true,
                name: true,
                stock: true,
                additionalPrice: true,
              },
            },
          },
        },
      },
    });

    if (!productInfo) {
      throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    }

    return productInfo;
  }

  async deleteProduct(
    productId: string,
    shopId: string,
    userId: string,
  ): Promise<void> {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      select: {
        userId: true,
        deletedAt: true,
      },
    });
    if (!shop || shop.userId !== userId || shop.deletedAt !== null) {
      throw new NotFoundException(
        '해당 상점에 대한 권한이 없거나 존재하지 않습니다.',
      );
    }

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        deletedAt: null,
      },
    });
    if (!product) throw new NotFoundException('상품이 존재하지 않습니다.');

    await this.prisma.product.updateMany({
      where: {
        id: productId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async updateProduct(
    productId: string,
    shopId: string,
    userId: string,
    updateData: ProductDto,
  ): Promise<void> {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
      select: { userId: true, deletedAt: true },
    });
    if (!shop || shop.userId !== userId || shop.deletedAt !== null) {
      throw new NotFoundException(
        '해당 상점에 대한 권한이 없거나 존재하지 않습니다.',
      );
    }

    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
    });
    if (!product) throw new NotFoundException('상품이 존재하지 않습니다.');

    const { image, option, ...data } = updateData;

    await this.prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: productId },
        data,
      });

      await tx.productImage.updateMany({
        where: { productId, deletedAt: null },
        data: { deletedAt: new Date() },
      });

      await tx.productImage.createMany({
        data: image.map((img) => ({
          url: img.url,
          productId,
        })),
      });

      const previousOptions = await tx.productOption.findMany({
        where: { productId, deletedAt: null },
        select: { id: true },
      });
      const previousOptionIds = previousOptions.map((opt) => opt.id);

      await tx.productOptionUnit.updateMany({
        where: {
          productOptionId: { in: previousOptionIds },
          deletedAt: null,
        },
        data: { deletedAt: new Date() },
      });

      await tx.productOption.updateMany({
        where: { id: { in: previousOptionIds } },
        data: { deletedAt: new Date() },
      });

      for (const opt of option) {
        const createdOption = await tx.productOption.create({
          data: {
            name: opt.name,
            stock: opt.stock,
            isRequired: opt.isRequired,
            product: { connect: { id: productId } },
          },
        });

        await tx.productOptionUnit.createMany({
          data: opt.units.map((unit) => ({
            name: unit.name,
            stock: unit.stock,
            additionalPrice: unit.additionalPrice,
            productOptionId: createdOption.id,
          })),
        });
      }
    });
  }

  async searchProduct(query: any): Promise<SearchProductDto> {
    const { keyword, page, limit, order } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(keyword && {
        name: {
          contains: keyword,
        },
      }),
      deletedAt: null,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: where,
        orderBy: {
          createdAt: order,
        },
        skip,
        take: limit,
        select: {
          id: true,
          shopId: true,
          thumbnailImageUrl: true,
          name: true,
          description: true,
          price: true,
        },
      }),
      this.prisma.product.count({ where: where }),
    ]);
    return {
      total,
      page,
      limit,
      data,
    };
  }

  async searchProductInShop(
    query: any,
    shopId: string,
  ): Promise<SearchProductDto> {
    const { keyword, page, limit, order } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...(keyword && {
        name: {
          contains: keyword,
        },
      }),
      shopId,
      deletedAt: null,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where: where,
        orderBy: {
          createdAt: order,
        },
        skip,
        take: limit,
        select: {
          id: true,
          shopId: true,
          thumbnailImageUrl: true,
          name: true,
          description: true,
          price: true,
        },
      }),
      this.prisma.product.count({ where: where }),
    ]);
    return {
      total,
      page,
      limit,
      data,
    };
  }
}
