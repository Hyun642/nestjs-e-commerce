import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { OrderDto } from './dto/orderitems.dto';

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async order(orderInfo: OrderDto, userId: string) {
    const { orderStatus, userAddressId } = orderInfo;
    const newOrder = await this.prisma.order.create({
      data: {
        userId,
        userAddressId,
        orderStatus,
      },
    });
    await Promise.all(
      orderInfo.orderItems.map((item) =>
        this.prisma.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            productOptionUnitId: item.productOptionUnitId,
            quantity: item.quantity,
          },
        }),
      ),
    );
  }

  async refund(orderId: string, userId: string) {
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

    const updatedOrder = await this.prisma.order.updateMany({
      where: { id: orderId, userId },
      data: {
        orderStatus: '환불진행',
      },
    });

    if (updatedOrder.count === 0)
      throw new NotFoundException('해당 주문을 찾을 수 없습니다.');
  }
}
