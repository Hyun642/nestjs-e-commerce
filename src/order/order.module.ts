import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { OrderRepository } from './order.repository';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, JwtStrategy],
})
export class OrderModule {}
