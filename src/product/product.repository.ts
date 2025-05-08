import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { ProductDto } from './dto/createProduct.dto';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(shopId: string, userId: string, product: ProductDto) {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
    });
    if (!shop || shop.userId !== userId || shop.deletedAt !== null) {
      throw new NotFoundException(
        '해당 상점에 대한 권한이 없거나 존재하지 않습니다.',
      );
    }

    const createdProduct = await this.prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        thumbnailImageUrl: product.thumnailImageUrl,
        description: product.description,
        shop: {
          connect: { id: shopId },
        },
      },
    });

    const productId = createdProduct.id;

    await Promise.all(
      product.image.map((img) =>
        this.prisma.productImage.create({
          data: {
            url: img.url,
            product: { connect: { id: productId } },
          },
        }),
      ),
    );

    for (const option of product.option) {
      const createdOption = await this.prisma.productOption.create({
        data: {
          name: option.name,
          stock: option.stock,
          isRequired: option.isRequired,
          product: {
            connect: { id: productId },
          },
        },
      });

      await Promise.all(
        option.units.map((unit) =>
          this.prisma.productOptionUnit.create({
            data: {
              name: unit.name,
              stock: unit.stock,
              additionalPrice: unit.additionalPrice,
              productOption: {
                connect: { id: createdOption.id },
              },
            },
          }),
        ),
      );
    }
  }

  async getProductList(shopId: string) {
    const productList = await this.prisma.product.findMany({
      where: {
        shopId,
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
      },
    });
    return productList;
  }

  async getProductDetail(productId: string) {
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
      },
    });

    if (!productInfo) {
      throw new NotFoundException('해당 상품이 존재하지 않습니다.');
    }

    const productImages = await this.prisma.productImage.findMany({
      where: {
        productId: productId,
        deletedAt: null,
      },
      select: {
        url: true,
      },
    });

    const productOptions = await this.prisma.productOption.findMany({
      where: {
        productId: productId,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        stock: true,
        isRequired: true,
      },
    });

    const productOptionsWithUnits = await Promise.all(
      productOptions.map(async (option) => {
        const units = await this.prisma.productOptionUnit.findMany({
          where: {
            productOptionId: option.id,
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            stock: true,
            additionalPrice: true,
          },
        });

        return {
          ...option,
          units,
        };
      }),
    );

    return {
      productInfo,
      productImages: productImages,
      productOptionsWithUnits: productOptionsWithUnits,
    };
  }
}
