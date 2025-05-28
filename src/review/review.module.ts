import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, JwtStrategy],
})
export class ReviewModule {}
