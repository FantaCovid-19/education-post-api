import type { Application } from 'express';
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { configs, IAppConfig } from '@config';
import { logger, stream } from '@utils/logger.util';
import IndexRouter from '@routes/index.route';
import errorMiddleware from '@middlewares/error.middleware';

export default class App {
  private app: Application;
  private port: string | number;
  private config: IAppConfig;
  private indexRouter: IndexRouter;
  private errorMiddleware: errorMiddleware;

  constructor() {
    this.app = express();
    this.config = configs;
    this.port = this.config.PORT || 3000;

    this.indexRouter = new IndexRouter();
    this.errorMiddleware = new errorMiddleware();

    this.initializeConfigure();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public start(): void {
    const port = this.normalizePort(this.port);

    this.app.listen(port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.config.NODE_ENV} ========`);
      logger.info(`🚀 App listening on the port ${port}`);
      logger.info(`🔗 API: ${this.config.API_URL}`);
      logger.info(`=================================`);
    });
  }

  public getApp(): Application {
    return this.app;
  }

  private async initializeConfigure(): Promise<void> {
    this.app.set('trust proxy', 1);

    this.app.use(morgan('dev', { stream }));
    this.app.use(cors()); // { origin: '*', credentials: true}
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(
      session({
        secret: this.config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
          httpOnly: true,
          secure: false,
          maxAge: 1000 * 60 * 60 * 24 * 7
        }
      })
    );
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
    this.app.use(this.errorMiddleware.httpExceptionError);
  }
}
