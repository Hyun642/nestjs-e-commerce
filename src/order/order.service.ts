import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderDto } from './dto/orderitems.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async order(orderInfo: OrderDto, userId: string) {
    await this.orderRepository.order(orderInfo, userId);
    return;
  }

  async refund(orderId: string, userId: string) {
    await this.orderRepository.refund(orderId, userId);
    return;
  }

  async return(orderId: string, userId: string) {
    await this.orderRepository.return(orderId, userId);
    return;
  }
}
