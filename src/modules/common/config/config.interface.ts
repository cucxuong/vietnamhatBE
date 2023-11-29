export interface AppConfig {
  port: number;
  env: string;

  session_key: string;
}

export interface FronendConfig {
  origin: string;
  domain: string;
}

export interface DatabaseConfig {
  uri: string;
}

export interface AuthConfig {
  access_secret_key: string;
  access_expire_time: string;
  refresh_secret_key: string;
  refresh_expire_time: string;
}

export interface MailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface VNHat2023Config {
  tournament_id: string;
}

export interface ConfigData {
  app: AppConfig;

  fronend: FronendConfig;

  mail: MailConfig;

  vnhat2023: VNHat2023Config;

  database: DatabaseConfig;

  auth: AuthConfig;
}
