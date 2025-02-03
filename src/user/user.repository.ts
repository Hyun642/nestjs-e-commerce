import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LogInDto } from './dto/login.dto';

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

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltOrRounds);

    const res = await this.prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashedPassword,
        phoneNumber: user.phoneNumber,
      },
    });
    return res;
  }

  async logIn(input: LogInDto): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (user && (await bcrypt.compare(input.password, user.password))) {
      return '로그인 성공';
    }
    throw new UnauthorizedException(
      '이메일 혹은 비밀번호가 일치하지 않거나 존재하지 않습니다.',
    );
  }

  // async findAllUser(): Promise<any> {
  //   return this.prisma.user.findMany();
  // }
}
