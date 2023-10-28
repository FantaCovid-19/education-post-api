import path from 'path';
import dotnenv from 'dotenv';
import { logger } from '@utils/logger.util';

dotnenv.config({ path: path.join(process.cwd(), '.env') });

export interface IAppConfig {
  APP_NAME: string;
  PORT: string | number;
  NODE_ENV: string | undefined;
  API_URL: string | undefined;
  JWT_SECRET: string | undefined;
  SALT_ROUNDS: string | number;
}

class AppConfig {
  public config: IAppConfig;

  constructor(configs: IAppConfig) {
    this.config = this.validateConfig(configs);
  }

  private validateConfig(config: IAppConfig): IAppConfig {
    for (const [key, value] of Object.entries(config)) {
      if (!value) throw logger.error(`Config ${key} is not defined!`);
    }

    return config;
  }

  public getConfig(): IAppConfig {
    return this.config;
  }
}

const production = process.env.NODE_ENV === 'production';
const configs = new AppConfig({
  NODE_ENV: process.env.NODE_ENV,
  APP_NAME: process.env.APP_NAME || 'app',
  PORT: process.env.PORT || 3000,
  API_URL: (() => {
    if (production) {
      return process.env.PRODUCTION_URL;
    }
    return process.env.LOCAL_URL;
  })(),
  JWT_SECRET: process.env.JWT_SECRET,
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10
}).getConfig();

export { configs };
