import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async signUp(signUpDto: SignUpDto): Promise<boolean> {
    await this.prisma.user.create({
      data: {
        email: signUpDto.email,
        name: signUpDto.name,
        password: signUpDto.password,
        phoneNumber: signUpDto.phoneNumber,
      },
    });
    return true;
  }

  // async findAllUser(): Promise<any> {
  //   return this.prisma.user.findMany();
  // }
}
