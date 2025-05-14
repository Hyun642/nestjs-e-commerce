import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma/prisma.service';

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}
}
