import { Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { OrderDto } from './dto/orderitems.dto';
import { SearchDto } from 'src/common/dto/search.dto';
import { OrderListResponseDto } from './dto/orderListResponse.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async order(orderInfo: OrderDto, userId: string): Promise<void> {
    await this.orderRepository.order(orderInfo, userId);
  }

  async refund(orderId: string, userId: string): Promise<void> {
    await this.orderRepository.refund(orderId, userId);
  }

  async return(orderId: string, userId: string): Promise<void> {
    await this.orderRepository.return(orderId, userId);
  }

  async getOrdersByUserId(
    query: SearchDto,
    userId: string,
  ): Promise<OrderListResponseDto> {
    return await this.orderRepository.getOrdersByUserId(query, userId);
  }
}
