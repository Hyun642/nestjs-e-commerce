import { Injectable } from '@nestjs/common';
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
}
