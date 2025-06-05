import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Get,
  Delete,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';
import { GetUser } from './get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserAddressDto } from './dto/address/createUserAddress.dto';
import { DefaultResponseDto } from 'src/common/dto/response.dto';
import { BusinessLicenseDto } from './dto/businessLicense/businessLicense.dto';
import { UserAddressEntity } from './entity/userAddress.entity';
import { UpdateUserAddressDto } from './dto/address/updateUserAddress.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '회원가입 성공',
    type: SignUpDto,
  })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: '중복 에러' })
  @Post('/signup')
  async signUp(@Body() user: SignUpDto): Promise<SignUpDto> {
    return await this.userService.signUp(user);
  }

  @ApiResponse({ status: HttpStatus.CREATED, description: '로그인 성공' })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '정보가 일치하지 않거나 존재 하지 않음',
  })
  @Post('/login')
  async logIn(@Body() input: LogInDto): Promise<{ accessToken: string }> {
    return await this.userService.logIn(input);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '주소 등록 성공',
    type: DefaultResponseDto,
  })
  @ApiBody({ type: CreateUserAddressDto })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Post('/address')
  async createUserAddress(
    @Body() userAddress: CreateUserAddressDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    const userId = user.id;
    await this.userService.createUserAddress(userAddress, userId);
    return {
      message: '주소 등록 성공',
      result: 'Success',
      statusCode: HttpStatus.CREATED,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '주소 삭제 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '이미 존재하지 않는 주소',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('/address/:userAddressId')
  async deleteUserAddress(
    @Param('userAddressId', ParseIntPipe) userAddressId: number,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.userService.deleteUserAddress(userAddressId, user.id);
    return {
      message: '주소 삭제 성공',
      result: 'Success',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '주소 조회 성공',
    type: UserAddressEntity,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/address')
  async getUserAddressById(
    @GetUser() user: User,
  ): Promise<UserAddressEntity[]> {
    return await this.userService.getUserAddressById(user.id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '주소 변경 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '존재하지 않거나 접근 권한이 없음.',
  })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: UpdateUserAddressDto })
  @UseGuards(JwtAuthGuard)
  @Patch('/address/:userAddressId')
  async updateUserAddressById(
    @Param('userAddressId', ParseIntPipe) userAddressId: number,
    @Body()
    addressInfo: UpdateUserAddressDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.userService.updateUserAddressById(
      userAddressId,
      addressInfo,
      user.id,
    );
    return {
      message: '주소 변경 성공',
      result: 'updated',
      statusCode: HttpStatus.OK,
    };
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '사업자 등록 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '사업자 등록 번호 누락',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: '인증 실패' })
  @ApiBearerAuth('access-token')
  @ApiBody({ type: BusinessLicenseDto })
  @UseGuards(JwtAuthGuard)
  @Post('/business-licenses')
  async createBusinessLicense(
    @Body() businessLicenceInfo: BusinessLicenseDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.userService.createBusinessLicense(
      businessLicenceInfo.businessId,
      user.id,
    );
    return {
      message: '[사업자 등록 정보] 등록 성공',
      result: 'success',
      statusCode: HttpStatus.CREATED,
    };
  }

  @ApiResponse({ status: HttpStatus.OK, description: '사업자 정보 반환 성공' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('/business-licenses')
  async getUserBusinessLicense(
    @GetUser() user: User,
  ): Promise<{ businessId: string; createdAt: Date }[]> {
    return await this.userService.getUserBusinessLicense(user.id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '사업자 정보 삭제 성공',
    type: DefaultResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '삭제할 사업자 등록번호를 찾을 수 없습니다.',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Delete('/business-licenses/:licenseId')
  async deleteUserBusinessLicense(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.userService.deleteUserBusinessLicense(id, user.id);
    return {
      message: '[사업자 등록 정보] 제거 성공',
      result: 'success',
      statusCode: HttpStatus.OK,
    };
  }
}
