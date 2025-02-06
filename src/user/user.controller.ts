import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/signup')
  async signUp(@Body() user: SignUpDto): Promise<SignUpDto> {
    return await this.userService.signUp(user);
  }

  @Post('/login')
  async logIn(@Body() input: LogInDto): Promise<{ accessToken: string }> {
    return await this.userService.logIn(input);
  }

  @Post('/sendtokentest')
  @UseGuards(AuthGuard())
  sendtokentest(@Req() req) {
    return req.user;
  }
}
