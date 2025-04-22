import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';
import { CreateUserAddressDto } from './dto/address/createUserAddress.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(user: SignUpDto): Promise<SignUpDto> {
    const res = await this.userRepository.signUp(user);
    return res;
  }

  async logIn(input: LogInDto): Promise<{ accessToken: string }> {
    return await this.userRepository.logIn(input);
  }

  async createUserAddress(
    userAddress: CreateUserAddressDto,
    userId: string,
  ): Promise<void> {
    await this.userRepository.createUserAddress(userAddress, userId);
  }

  async deleteUserAddress(
    userAddressId: number,
    userId: string,
  ): Promise<void> {
    await this.userRepository.deleteUserAddress(userAddressId, userId);
  }
}
