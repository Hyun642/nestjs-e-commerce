import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as config from 'config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = config.get('server');
  const port = serverConfig.port;
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
  Logger.log(`App running on port ${port}`);
}
bootstrap();
