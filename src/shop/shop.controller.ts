import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateShopDto } from './dto/entity/createshop.dto';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { ShopService } from './shop.service';
import { DefaultResponseDto } from 'src/common/dto/response.dto';
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: HttpStatus.CREATED, description: '상점 등록 성공' })
  @ApiBody({ type: CreateShopDto })
  @UseGuards(JwtAuthGuard)
  @Post('/createShop')
  async createShop(
    @Body() shopInfo: CreateShopDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.shopService.createShop(shopInfo, user.id);
    return {
      message: '[상점 등록 정보] 등록 성공',
      result: 'success',
      statusCode: HttpStatus.CREATED,
    };
  }
}
