import path from 'path';
import dotnenv from 'dotenv';

dotnenv.config({ path: path.join(process.cwd(), '.env') });

export interface IAppConfig {
  NODE_ENV: string;
  APP_NAME: string;
  PORT: string | number;
  API_URL: string | undefined;
  JWT_SECRET: string;
  SALT_ROUNDS: number;
  SESSION_SECRET: string;
}

class AppConfig {
  public config: IAppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): IAppConfig {
    const production = process.env.NODE_ENV === 'production';

    return {
      NODE_ENV: process.env.NODE_ENV || 'development',
      APP_NAME: process.env.APP_NAME || 'app',
      PORT: process.env.PORT || 3000,
      API_URL: production ? process.env.PRODUCTION_URL : process.env.LOCAL_URL || 'http://localhost:3000',
      JWT_SECRET: process.env.JWT_SECRET || 'secret',
      SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
      SESSION_SECRET: process.env.SESSION_SECRET || 'secret'
    };
  }

  public getConfig(): IAppConfig {
    return this.config;
  }
}

const config = new AppConfig().getConfig();
export const { NODE_ENV, APP_NAME, PORT, API_URL, JWT_SECRET, SALT_ROUNDS, SESSION_SECRET } = config;
