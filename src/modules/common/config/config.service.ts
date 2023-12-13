import { Injectable } from '@nestjs/common';
import { ConfigData } from './config.interface';

@Injectable()
export class ConfigService {
  private config: ConfigData;

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      app: {
        port: (env.PORT && Number(env.PORT)) || 3000,
        env: env.APP_ENV || 'local',
        session_key: env.SESSION_KEY || '',
      },
      fronend: {
        origin: env.FE_ORIGIN || '',
        domain: env.FE_DOMAIN || '',
      },
      mail: {
        host: env.MAIL_HOST || '',
        port: (env.MAIL_PORT && Number(env.MAIL_PORT)) || 0,
        username: env.MAIL_USERNAME || '',
        password: env.MAIL_PASSWORD || '',
      },
      vnhat2023: {
        tournament_id: env.VIETNAM_HAT_2023_TOURNAMENT_ID || '',
      },
      database: {
        uri: env.MONGODB_URI || '',
      },
      auth: {
        access_secret_key: env.JWT_ACCESS_SECRET_KEY || '',
        access_expire_time: env.JWT_ACCESS_EXPIRE_TIME || '',
        refresh_secret_key: env.JWT_REFRESH_SECRET_KEY || '',
        refresh_expire_time: env.JWT_REFRESH_EXPIRE_TIME || '',
      },
    };
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
