import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { SignUpDto } from '../dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { LogInDto } from '../dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserAddressDto } from '../dto/address/createUserAddress.dto';
import { UserAddressEntity } from '../dto/entity/userAddress.entity';
import { UpdateUserAddressDto } from '../dto/address/updateUserAddress.dto';

@Injectable()
export class UserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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

  async logIn(input: LogInDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });
    if (user && (await bcrypt.compare(input.password, user.password))) {
      const payload = user.id;
      const accessToken = this.jwtService.sign({ id: payload });
      return { accessToken };
    }
    throw new UnauthorizedException(
      '이메일 혹은 비밀번호가 일치하지 않거나 존재하지 않습니다.',
    );
  }

  async createUserAddress(
    userAddress: CreateUserAddressDto,
    userId: string,
  ): Promise<void> {
    await this.prisma.userAddress.create({
      data: {
        name: userAddress.name,
        address: userAddress.address,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async deleteUserAddress(
    userAddressId: number,
    userId: string,
  ): Promise<void> {
    const info = await this.prisma.userAddress.findFirst({
      where: {
        id: userAddressId,
        userId: userId,
        deletedAt: null,
      },
    });

    if (!info) {
      throw new NotFoundException('삭제되었거나 존재하지 않습니다.');
    }

    await this.prisma.userAddress.updateMany({
      where: {
        userId,
        id: userAddressId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async getUserAddressById(userId: string): Promise<UserAddressEntity[]> {
    return await this.prisma.userAddress.findMany({
      where: {
        userId,
      },
    });
  }

  async createBusinessLicense(
    businessId: string,
    userId: string,
  ): Promise<void> {
    if (!businessId) {
      throw new BadRequestException('사업자 등록 번호를 입력해주세요.');
    }
    const exists = await this.prisma.businessLicense.findFirst({
      where: {
        userId: userId,
        businessId: businessId,
      },
    });
    if (exists) {
      throw new ConflictException('이미 등록된 사업자번호입니다.');
    }
    await this.prisma.businessLicense.create({
      data: {
        businessId: businessId,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getUserBusinessLicense(
    userId: string,
  ): Promise<{ businessId: string; createdAt: Date }[]> {
    const info = await this.prisma.businessLicense.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
      select: {
        businessId: true,
        createdAt: true,
      },
    });
    return info;
  }

  async deleteUserBusinessLicense(id: number, userId: string): Promise<void> {
    const info = await this.prisma.businessLicense.findFirst({
      where: {
        userId: userId,
        id: id,
        deletedAt: null,
      },
    })
    if (!info) {
      throw new NotFoundException('삭제할 사업자 등록번호를 찾을 수 없습니다.');
    }

    const result = await this.prisma.businessLicense.updateMany({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    if (result.count === 0) {
      throw new NotFoundException('삭제할 사업자 등록번호를 찾을 수 없습니다.');
    }
  }

  async updateUserAddressById(
    body: UpdateUserAddressDto,
    userId: string,
  ): Promise<void> {
    const info = await this.prisma.userAddress.findFirst({
      where: {
        userId,
        id: body.id,
        deletedAt: null,
      },
    });
    if (!info) {
      throw new NotFoundException('존재하지 않거나 접근 권한이 없습니다.');
    }

    await this.prisma.userAddress.updateMany({
      where: {
        userId,
        id: body.id,
      },
      data: {
        name: body.name,
        address: body.address,
      },
    });
  }
}
