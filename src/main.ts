import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { PrismaService } from './databases/prisma/prisma.service';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
  Logger.log(`App running on port 3000`);
}
bootstrap();
