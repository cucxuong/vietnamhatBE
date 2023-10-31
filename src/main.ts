import {NestFactory} from '@nestjs/core';
import {useContainer} from 'class-validator';
import {AppModule} from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const currentEnv = configService.get<string>('APP_ENV') ?? '';

    let origins = [configService.get<string>('FE_ORIGIN') ?? '*'];
    if (currentEnv !== 'production') {
        origins = [...origins, 'http://localhost:3001']
    }

    // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableCors({
        origin: origins,
        credentials: true,
    });
    app.use(cookieParser());

    app.use(
        session({
            secret: configService.get<string>('SESSION_KEY') ?? 'session_secret_key',
            resave: false,
            saveUninitialized: false,
        }),
    );


    useContainer(app.select(AppModule), {fallbackOnErrors: true});

    await app.listen(3000);
}

bootstrap();
