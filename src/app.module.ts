import { Module, ValidationPipe } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './configs/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
  imports: [TypeOrmModule.forRoot(typeORMConfig), BoardsModule, AuthModule],
})
export class AppModule {}
