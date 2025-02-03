import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async signUp(user: SignUpDto): Promise<SignUpDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new ConflictException('이미 등록된 이메일 입니다.');
    }
    const res = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: user.password,
        phoneNumber: user.phoneNumber,
      },
    });
    return res;
  }

  // async findAllUser(): Promise<any> {
  //   return this.prisma.user.findMany();
  // }
}
