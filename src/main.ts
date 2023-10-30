import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: [configService.get<string>('FE_ORIGIN') ?? '*'],
    credentials: true,
  });
  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
