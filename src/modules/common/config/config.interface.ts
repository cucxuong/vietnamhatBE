export interface AppConfig {
  env: string;
  port: number;
}

export interface DatabaseConfig {
  url: string;
}

export interface JwtConfig {
  access_secret_key: string;
  refresh_secret_key: string;
  token_expire_time: string;
  refresh_token_expire_time: string;
}

export interface MailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface SessionConfig {
  key: string;
}

export interface FeConfig {
  origin: string;
  domain: string;
  vietnam_hat_tournament_id: string;
}

export interface ConfigData {
  app: AppConfig;

  database: DatabaseConfig;

  jwt: JwtConfig;

  mail: MailConfig;

  session: SessionConfig;

  fe: FeConfig;
}
