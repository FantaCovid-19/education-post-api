import { config } from 'dotenv';

config();

export interface IConfig {
  appName: string;
  nodeEnv: string | undefined;
  apiUrl: string | undefined;
  jwtSecret: string | undefined;
}

const production = process.env.NODE_ENV === 'production';
export const configs: IConfig = {
  appName: process.env.APP_NAME || 'app',
  nodeEnv: process.env.NODE_ENV,
  apiUrl: (() => {
    if (production) {
      return process.env.PRODUCTION_URL;
    }
    return process.env.LOCAL_URL;
  })(),
  jwtSecret: process.env.JWT_SECRET
};
