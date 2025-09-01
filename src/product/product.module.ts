import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { ProductRepository } from './product.repository';

@Module({
  controllers: [ProductController],
  providers: [ProductService, JwtStrategy, ProductRepository],
})
export class ProductModule {}
