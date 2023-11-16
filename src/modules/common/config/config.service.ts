import { Injectable } from '@nestjs/common';
import { ConfigData } from './config.interface';

@Injectable()
export class ConfigService {
  private config: ConfigData;

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(processEnv: NodeJS.ProcessEnv): ConfigData {
    return {
      app: {
        env: processEnv.AP_ENV || 'local',
        port: (processEnv.port && Number(processEnv.port)) || 3000,
      },
      database: {
        url: processEnv.MONGODB_URI || '',
      },
      jwt: {
        access_secret_key: processEnv.JWT_ACCESS_SECRET_KEY || '',
        refresh_secret_key: processEnv.JWT_REFRESH_SECRET_KEY || '',
        token_expire_time: processEnv.JWT_ACCESS_EXPIRE_TIME || '5m',
        refresh_token_expire_time: processEnv.JWT_SECRET_EXPIRE_TIME || '1d',
      },
      mail: {
        host: processEnv.MAIL_HOST || '',
        port: (processEnv.MAIL_PORT && Number(processEnv.MAIL_PORT)) || 465,
        username: processEnv.MAIL_USERNAME || '',
        password: processEnv.MAIL_PASSWORD || '',
      },
      session: {
        key: processEnv.SESSION_KEY || 'session_key',
      },
      fe: {
        origin: processEnv.FE_ORIGIN || '',
        domain: processEnv.FE_DOMAIN || '',
        vietnam_hat_tournament_id: processEnv.VIETNAM_HAT_2023_TOURNAMENT_ID || '',
      },
    };
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
