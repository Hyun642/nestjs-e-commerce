import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(user: SignUpDto): Promise<SignUpDto> {
    const res = await this.userRepository.signUp(user);
    return res;
  }

  // async findAllUser() {
  //   return await this.userRepository.findAllUser();
  // }
  //   login(email: string, password: string): string {
  //     if (this.user[0]) {
  //       return 'good';
  //     }
  //     throw new NotFoundException(
  //       `not exist email: ${email}, password: ${password}`,
  //     );
  //   }
}
