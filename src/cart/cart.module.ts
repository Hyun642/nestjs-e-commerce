import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { CartRepository } from './cart.repository';

@Module({
  controllers: [CartController],
  providers: [CartService, CartRepository, JwtStrategy],
})
export class CartModule {}
