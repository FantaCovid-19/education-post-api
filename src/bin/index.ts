import type { Application } from 'express';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { configs, IConfig } from '@config';
import { logger, stream } from '@utils/logger.util';
import IndexRouter from '@routes/index.route';
import errorMiddleware from '@middlewares/error.middleware';

export default class App {
  private app: Application;
  private port: string | number;
  private config: IConfig = configs;
  private indexRouter = new IndexRouter();

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.initializeConfigure();
    this.initializeRoutes();
    this.initializeErrorHandling();
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

  private async initializeConfigure(): Promise<void> {
    this.app.use(morgan('dev', { stream }));
    this.app.use(cors()); // { origin: '*', credentials: true}
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    this.app.use('/api/v1', this.indexRouter.getRouter());
  }

  private normalizePort(port: number | string): number {
    if (typeof port !== 'string' && typeof port !== 'number') {
      throw new TypeError(`Argument of type ${typeof port} cannot be used as port!`);
    }

    return Number(port);
  }

  private initializeErrorHandling(): void {
    this.app.use(errorMiddleware);
  }
}
