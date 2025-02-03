import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(user: SignUpDto): Promise<SignUpDto> {
    const res = await this.userRepository.signUp(user);
    return res;
  }

  async logIn(input: LogInDto) {
    return await this.userRepository.logIn(input);
    // throw new NotFoundException(
    //   `not exist email: ${email}, password: ${password}`,
    // );
  }

  // async findAllUser() {
  //   return await this.userRepository.findAllUser();
  // }
}
