import type { Application, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { configs, IConfig } from '@config';
import { logger } from '@utils/logger';

export default class App {
  private app: Application;
  private port: string | number;
  private config: IConfig = configs;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.configure();
    this.init();
  }

  public start(): void {
    const port = this.normalizePort(this.port);

    this.app.listen(port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.config.nodeEnv} ========`);
      logger.info(`🚀 App listening on the port ${port}`);
      logger.info(`🔗 API: ${this.config.apiUrl}`);
      logger.info(`=================================`);
    });
  }

  private init(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.status(200).json({ message: 'Hello World!' });
    });
  }

  private async configure(): Promise<void> {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private normalizePort(port: number | string): number {
    if (typeof port !== 'string' && typeof port !== 'number') {
      throw new TypeError(`Argument of type ${typeof port} cannot be used as port!`);
    }

    return Number(port);
  }
}
