import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as basicAuth from 'express-basic-auth';
import * as session from 'express-session';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { ConfigService } from './modules/common/config/config.service';

dotenv.config();

async function bootstrap() {
  const configService = new ConfigService();
  configService.loadFromEnv();

  const app = await NestFactory.create(AppModule);

  // Swagger
  app.use(
    '/swagger',
    basicAuth({
      challenge: true,
      users: {
        vietnamhat2023: 'VietNamHat2023',
      },
    }),
  );
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

  const currentEnv = configService.get().app.env ?? '';

  let origins = [configService.get().fe.origin ?? '*'];
  if (currentEnv !== 'production') {
    origins = [...origins, 'http://localhost:3001'];
  }

  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [
            `'self'`,
            'data:',
            'https: data:',
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
          manifestSrc: [
            `'self'`,
            'apollo-server-landing-page.cdn.apollographql.com',
          ],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com'],
        },
      },
    }),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableCors({
    origin: origins,
    credentials: true,
  });
  app.use(cookieParser());

  app.use(
    session({
      secret: configService.get().session.key,
      resave: false,
      saveUninitialized: false,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}

bootstrap();
