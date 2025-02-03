import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/signup.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/signup')
  async signUp(@Body() user: SignUpDto): Promise<SignUpDto> {
    return await this.userService.signUp(user);
  }

  // @Post('login')
  // login(@Body('email') email: string, @Body('password') password: string) {
  //   return this.userService.login(email, password);
  // }

  // @Get('findAllUser')
  // findAllUser() {
  //   return this.userService.findAllUser();
  // }
}
