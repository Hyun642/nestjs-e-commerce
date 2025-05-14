import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ShopRepository } from './shop.repository';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [ShopController],
  providers: [ShopService, ShopRepository, JwtStrategy],
})
export class ShopModule {}
