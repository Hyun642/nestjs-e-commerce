import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
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
}
