import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { SignUpDto } from './dto/signup.dto';
import { LogInDto } from './dto/login.dto';
import { CreateUserAddressDto } from './dto/address/createUserAddress.dto';
import { UserAddressEntity } from './entity/userAddress.entity';
import { UpdateUserAddressDto } from './dto/address/updateUserAddress.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(user: SignUpDto): Promise<void> {
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

  async getUserAddressById(userId: string): Promise<UserAddressEntity[]> {
    return await this.userRepository.getUserAddressById(userId);
  }

  async updateUserAddressById(
    userAddressId: number,
    addressInfo: UpdateUserAddressDto,
    userId: string,
  ): Promise<void> {
    return await this.userRepository.updateUserAddressById(
      userAddressId,
      addressInfo,
      userId,
    );
  }

  async createBusinessLicense(
    businessId: string,
    userId: string,
  ): Promise<void> {
    await this.userRepository.createBusinessLicense(businessId, userId);
  }

  async getUserBusinessLicense(
    userId: string,
  ): Promise<{ businessId: string; createdAt: Date }[]> {
    return await this.userRepository.getUserBusinessLicense(userId);
  }

  async deleteUserBusinessLicense(id: number, userId: string): Promise<void> {
    return await this.userRepository.deleteUserBusinessLicense(id, userId);
  }
}
