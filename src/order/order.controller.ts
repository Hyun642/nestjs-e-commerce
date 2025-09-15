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
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { OrderDto } from './dto/orderitems.dto';
import { DefaultResponseDto } from 'src/common/dto/response.dto';
import { PaginationDto } from 'src/common/dto/paginationDto';
import { OrderListResponseDto } from './dto/orderListResponse.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '주문 성공',
    type: DefaultResponseDto,
  })
  @ApiBody({ type: OrderDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/')
  async order(
    @Body() orderInfo: OrderDto,
    @GetUser()
    user: User,
  ): Promise<DefaultResponseDto<null>> {
    await this.orderService.order(orderInfo, user.id);
    return {
      message: '[주문] 주문 성공',
      result: 'success',
      statusCode: HttpStatus.CREATED,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '환불 요청 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '해당 주문에 대한 권한이 없거나 존재하지 않습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '해당 상태에서는 환불이 불가합니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('/refund/:id')
  async refund(
    @Param('id') orderId: string,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto<null>> {
    await this.orderService.refund(orderId, user.id);
    return {
      message: '[주문] 환불 요청 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '반품 요청 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '해당 주문에 대한 권한이 없거나 존재하지 않습니다.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '해당 상태에서는 반품이 불가합니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('/return/:id')
  async return(
    @Param('id') orderId: string,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto<null>> {
    await this.orderService.return(orderId, user.id);
    return {
      message: '[주문] 반품 요청 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiResponse({ status: HttpStatus.OK, type: OrderListResponseDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getOrdersByUserId(
    @Query() query: PaginationDto,
    @GetUser() user: User,
  ): Promise<OrderListResponseDto> {
    return await this.orderService.getOrdersByUserId(query, user.id);
  }
}
