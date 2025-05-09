import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CreateShopDto } from './dto/createshop.dto';
import { GetUser } from 'src/user/get-user.decorator';
import { User } from '@prisma/client';
import { ShopService } from './shop.service';
import { DefaultResponseDto } from 'src/common/dto/response.dto';
import { GetShopInfoDto } from './dto/getShopInfo.dto';
import { SearchDto } from '../common/dto/search.dto';
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

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: HttpStatus.OK, description: '상점 조회 성공' })
  @Get('/getMyShopList')
  @UseGuards(JwtAuthGuard)
  async getMyShopList(@GetUser() user: User): Promise<GetShopInfoDto[] | null> {
    return this.shopService.getMyShopList(user.id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ShopId로 상점 조회 성공',
  })
  @Get('/getShopById/:shopId')
  async getShopById(
    @Param('shopId') shopId: string,
  ): Promise<GetShopInfoDto | null> {
    return this.shopService.getShopById(shopId);
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: HttpStatus.OK, description: '상점 업데이트 성공' })
  @Patch('/updateMyShopById/:shopId')
  @UseGuards(JwtAuthGuard)
  async updateMyShopById(
    @Param('shopId') shopId: string,
    @Body() body: CreateShopDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.shopService.updateMyShopById(shopId, user.id, body);
    return {
      message: '[상점 등록 정보] 업데이트 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: HttpStatus.OK, description: '상점 삭제 성공' })
  @Delete('/deleteMyShopById/:shopId')
  @UseGuards(JwtAuthGuard)
  async deleteMyShopById(
    @Param('shopId') shopId: string,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.shopService.deleteMyShopById(shopId, user.id);
    return {
      message: '[상점 등록 정보] 삭제 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiResponse({ status: HttpStatus.OK, description: '상점 검색 성공' })
  @Get('/search')
  async searchShop(@Query() query: SearchDto): Promise<any> {
    return await this.shopService.searchShop(query);
  }
}
