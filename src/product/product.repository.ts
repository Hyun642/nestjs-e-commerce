import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { ProductDto } from './dto/createProduct.dto';
import { ProductEntity } from './dto/entity/product.entity';
import { ProductDetailResponse } from './dto/product-response.type';

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

    const createdProduct = await this.prisma.product.create({
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

  async getProductList(shopId: string): Promise<ProductEntity[]> {
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

  async getProductDetail(productId: string): Promise<ProductDetailResponse> {
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

  async deleteProduct(
    productId: string,
    shopId: string,
    userId: string,
  ): Promise<void> {
    const shop = await this.prisma.shop.findUnique({
      where: { id: shopId },
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
    const shop = await this.prisma.shop.findUnique({ where: { id: shopId } });
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

    const { image, option, ...data } = updateData;

    await this.prisma.product.update({
      where: { id: productId },
      data,
    });

    await this.prisma.productImage.updateMany({
      where: { productId, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    await Promise.all(
      image.map((img) =>
        this.prisma.productImage.create({
          data: {
            url: img.url,
            product: { connect: { id: productId } },
          },
        }),
      ),
    );

    const previousOptions = await this.prisma.productOption.findMany({
      where: { productId, deletedAt: null },
      select: { id: true },
    });

    const previousOptionIds = previousOptions.map((opt) => opt.id);

    await this.prisma.productOptionUnit.updateMany({
      where: {
        productOptionId: { in: previousOptionIds },
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    await this.prisma.productOption.updateMany({
      where: { id: { in: previousOptionIds } },
      data: { deletedAt: new Date() },
    });

    for (const opt of option) {
      const createdOption = await this.prisma.productOption.create({
        data: {
          name: opt.name,
          stock: opt.stock,
          isRequired: opt.isRequired,
          product: { connect: { id: productId } },
        },
      });

      await Promise.all(
        opt.units.map((unit) =>
          this.prisma.productOptionUnit.create({
            data: {
              name: unit.name,
              stock: unit.stock,
              additionalPrice: unit.additionalPrice,
              productOption: { connect: { id: createdOption.id } },
            },
          }),
        ),
      );
    }
  }

  async searchProduct(query: any): Promise<any> {
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

  async searchProductInShop(query: any, shopId: string): Promise<any> {
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
