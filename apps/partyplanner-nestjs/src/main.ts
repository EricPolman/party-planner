import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './instrument';
import { EntityNotFoundExceptionFilter } from './core/prisma-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
