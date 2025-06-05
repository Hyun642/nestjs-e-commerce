import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AddCartItem } from './dto/addCartIem.dto';
import { DefaultResponseDto } from 'src/common/dto/response.dto';
import { CartItemWithOptionUnitsDto } from './dto/cartItem.type';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '장바구니 아이템 등록 성공',
    type: DefaultResponseDto,
  })
  @ApiBody({ type: AddCartItem })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/item')
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

  @ApiResponse({
    status: HttpStatus.OK,
    description: '장바구니 조회 성공',
    type: CartItemWithOptionUnitsDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getMyCartItems(
    @GetUser() user: User,
  ): Promise<CartItemWithOptionUnitsDto[]> {
    return await this.cartService.getMyCartItems(user.id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '장바구니 아이템 삭제 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 아이템에 대한 권한이 없거나 이미 삭제 되었습니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('/item/:cartItemId')
  async deleteCartItem(
    @Param('cartItemId') cartItemId: number,
    @GetUser()
    user: User,
  ): Promise<DefaultResponseDto> {
    await this.cartService.deleteCartItem(cartItemId, user.id);
    return {
      message: '[장바구니 아이템 정보] 삭제 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '장바구니 아이템 수정 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 아이템에 대한 권한이 없습니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Patch('/item/:cartItemId')
  async updateCartItem(
    @Param('cartItemId') cartItemId: number,
    @Body() itemInfo: AddCartItem,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.cartService.updateCartItem(cartItemId, itemInfo, user.id);
    return {
      message: '[장바구니 아이템 정보] 수정 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }
}
