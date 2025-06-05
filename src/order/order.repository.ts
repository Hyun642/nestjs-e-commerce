import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { OrderDto } from './dto/orderitems.dto';
import { SearchDto } from 'src/common/dto/search.dto';
import { OrderListResponseDto } from './dto/orderListResponse.dto';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async order(orderInfo: OrderDto, userId: string): Promise<void> {
    const { orderStatus, userAddressId, orderItems } = orderInfo;

    if (orderItems.length === 0) {
      throw new BadRequestException('최소 1개 이상의 주문 항목이 필요합니다.');
    }

    await this.prisma.$transaction(async () => {
      const newOrder = await this.prisma.order.create({
        data: {
          userId,
          userAddressId,
          orderStatus,
        },
      });

      await this.prisma.orderItem.createMany({
        data: orderInfo.orderItems.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          productOptionUnitId: item.productOptionUnitId,
          quantity: item.quantity,
        })),
      });
    });
  }

  async refund(orderId: string, userId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      throw new ForbiddenException(
        '해당 주문에 대한 권한이 없거나 존재하지 않습니다.',
      );
    }

    if (
      order.orderStatus != '결제완료' &&
      order.orderStatus != '배송중' &&
      order.orderStatus != '도착'
    ) {
      throw new BadRequestException('해당 상태에서는 환불이 불가합니다.');
    }

    await this.prisma.order.update({
      where: { id: orderId, userId },
      data: {
        orderStatus: '환불진행',
      },
    });
  }

  async return(orderId: string, userId: string): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      throw new ForbiddenException(
        '해당 주문에 대한 권한이 없거나 존재하지 않습니다.',
      );
    }

    if (order.orderStatus != '도착') {
      throw new BadRequestException('해당 상태에서는 반품이 불가합니다.');
    }

    await this.prisma.order.update({
      where: { id: orderId, userId },
      data: {
        orderStatus: '반품진행',
      },
    });
  }

  async getOrdersByUserId(
    query: SearchDto,
    userId: string,
  ): Promise<OrderListResponseDto> {
    const { page, limit, order } = query;
    const skip = (page - 1) * limit;
    const where = {
      userId: userId,
      deletedAt: null,
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where: where,
        orderBy: {
          createdAt: order,
        },
        skip,
        take: limit,
        select: {
          id: true,
          orderStatus: true,
          createdAt: true,
          userAddress: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
          orderItem: {
            select: {
              product: {
                select: { name: true, price: true },
              },
              productOptionUnit: {
                select: { name: true, additionalPrice: true },
              },
            },
          },
        },
      }),
      this.prisma.order.count({ where: where }),
    ]);
    return {
      total,
      page,
      limit,
      data,
    };
  }
}
