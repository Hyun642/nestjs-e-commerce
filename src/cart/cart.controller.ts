import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AddCartItem } from './dto/addCartIem.dto';
import { DefaultResponseDto } from 'src/common/dto/response.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/addCartItem')
  async addCartItem(
    @Body() itemInfo: AddCartItem,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.cartService.addCartItem(itemInfo, user.id);
    return {
      message: '[장바구니 아이템 정보] 등록 성공',
      result: 'success',
      statusCode: HttpStatus.CREATED,
    };
  }
}
