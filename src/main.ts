import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Swagger
  const config = new DocumentBuilder()
    .addBearerAuth({
      type: 'http',
      description: 'Enter JWT token',
      in: 'header',
    })
    .setTitle('Vietnam Ultimate APIs')
    .setDescription('The API List of Vietnam Ultimate')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  let origins = [configService.get().fronend.origin ?? ''];
  if (currentEnv !== 'production') {
    origins = [...origins, 'http://localhost:3001'];
  }

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
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
