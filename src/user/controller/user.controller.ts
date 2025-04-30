import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { SignUpDto } from '../dto/signup.dto';
import { LogInDto } from '../dto/login.dto';
import { GetUser } from '../get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CreateUserAddressDto } from '../dto/address/createUserAddress.dto';
import { DeleteUserAddressDto } from '../dto/address/deleteUserAddress.dto';
import { DefaultResponseDto } from 'src/common/dto/response.dto';
import { UserAddressEntity } from '../dto/entity/userAddress.entity';
import { UpdateUserAddressDto } from '../dto/address/updateUserAddress.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiResponse({ status: 409, description: '중복 에러' })
  @Post('/signup')
  async signUp(@Body() user: SignUpDto): Promise<SignUpDto> {
    return await this.userService.signUp(user);
  }

  @ApiResponse({ status: 201, description: '로그인 성공' })
  @Post('/login')
  async logIn(@Body() input: LogInDto): Promise<{ accessToken: string }> {
    return await this.userService.logIn(input);
  }

  @Post('/sendtokentest')
  @UseGuards(JwtAuthGuard)
  sendtokentest(@GetUser() user: User) {
    return user;
  }

  @ApiBearerAuth('access-token')
  @ApiResponse({ status: HttpStatus.CREATED, description: '주소 등록 성공' })
  @Post('/createUserAddress')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createUserAddress(
    @Body() userAddress: CreateUserAddressDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    const userId = user.id;
    await this.userService.createUserAddress(userAddress, userId);
    return {
      message: '주소 등록 성공',
      result: 'Success',
      statusCode: 201,
    };
  }

  @ApiResponse({ status: HttpStatus.OK, description: '주소 삭제 성공' })
  @ApiBearerAuth('access-token')
  @Delete('/deleteUserAddress')
  @UseGuards(JwtAuthGuard)
  async deleteUserAddress(
    @Body() body: DeleteUserAddressDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    const userId = user.id;
    const userAddressId = body.id;
    await this.userService.deleteUserAddress(userAddressId, userId);
    return {
      message: '주소 삭제 성공',
      result: 'Success',
      statusCode: 200,
    };
  }

  @ApiResponse({ status: HttpStatus.OK, description: '주소 조회 성공' })
  @ApiBearerAuth('access-token')
  @Get('/getUserAddressById')
  @UseGuards(JwtAuthGuard)
  async getUserAddressById(
    @GetUser() user: User,
  ): Promise<UserAddressEntity[]> {
    return await this.userService.getUserAddressById(user.id);
  }

  @ApiResponse({ status: HttpStatus.OK, description: '주소 변경 성공' })
  @ApiBearerAuth('access-token')
  @Patch('/updateUserAddressById')
  @UseGuards(JwtAuthGuard)
  async updateUserAddressById(
    @Body() body: UpdateUserAddressDto,
    @GetUser() user: User,
  ): Promise<DefaultResponseDto> {
    await this.userService.updateUserAddressById(body, user.id);
    return {
      message: '주소 변경 성공',
      result: 'updated',
      statusCode: 200,
    };
  }
}
