import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { ConfigService } from './modules/common/config/config.service';

dotenv.config();

async function bootstrap() {
  const configService = new ConfigService();
  configService.loadFromEnv();

  const app = await NestFactory.create(AppModule);

  const currentEnv = configService.get().app.env ?? '';

  let origins = [configService.get().fronend.origin ?? ''];
  if (currentEnv !== 'production') {
    origins = [...origins, 'http://localhost:3001'];
  }

  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: origins,
    credentials: true,
  });
  app.use(cookieParser());

  app.use(
    session({
      secret: configService.get().app.session_key ?? '',
      resave: false,
      saveUninitialized: false,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configService.get().app.port);
}

bootstrap();
