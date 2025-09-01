import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { OrderDto } from './dto/orderitems.dto';
import { DefaultResponseDto } from 'src/common/dto/response.dto';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { OrderListResponseDto } from './dto/orderListResponse.dto';

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
  @Patch('/refund/:id')
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
  @Patch('/return/:id')
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

  @ApiResponse({ status: 200, type: OrderListResponseDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/list')
  async getOrdersByUserId(
    @Query() query: PaginationDto,
    @GetUser() user: User,
  ): Promise<OrderListResponseDto> {
    return await this.orderService.getOrdersByUserId(query, user.id);
  }
}
