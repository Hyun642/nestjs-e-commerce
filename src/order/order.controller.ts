import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { OrderDto } from './dto/orderitems.dto';
import { DefaultResponseDto } from 'src/common/dto/response.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async order(
    @Body() orderInfo: OrderDto,
    @GetUser()
    user: User,
  ): Promise<DefaultResponseDto> {
    await this.orderService.order(orderInfo, user.id);
    return {
      message: '[주문] 주문 성공',
      result: 'success',
      statusCode: HttpStatus.CREATED,
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/refund/:id')
  async refund(
    @Param('id') orderId: string,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.orderService.refund(orderId, user.id);
    return {
      message: '[주문] 환불 요청 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/return/:id')
  async return(
    @Param('id') orderId: string,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.orderService.return(orderId, user.id);
    return {
      message: '[주문] 반품 요청 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }
}
