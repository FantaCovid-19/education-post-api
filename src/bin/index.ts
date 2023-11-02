import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import path from 'path';
import session from 'express-session';
import SwaggerUI from 'swagger-ui-express';

import { PORT, NODE_ENV, API_URL, SESSION_SECRET } from '../configs';
import { loggerUtils } from '../utils/logger.util';
import { getAllFiles } from '../utils/getFiles.util';
import { errorMiddleware } from '../middlewares/error.middleware';
import SwaggerJSDoc from '../docs/swagger';

export default class App {
  private app: Application;
  private env: string;
  private port: string | number;

  constructor() {
    this.app = express();
    this.port = PORT || 3000;
    this.env = NODE_ENV;

    this.initializeConfigure();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public listen(): void {
    const port = this.normalizePort(this.port);

    this.app.listen(port, () => {
      loggerUtils.info(`=================================`);
      loggerUtils.info(`======= ENV: ${this.env} ========`);
      loggerUtils.info(`🚀 App listening on the port ${port}`);
      loggerUtils.info(`🔗 API: ${API_URL}`);
      loggerUtils.info(`=================================`);
    });
  }

  public getApp(): Application {
    return this.app;
  }

  private async initializeConfigure(): Promise<void> {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());

    this.app.set('trust proxy', 1);
    this.app.disable('x-powered-by');

    this.app.use(morgan('dev', { stream: loggerUtils.stream() }));

    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(
      session({
        secret: SESSION_SECRET,
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

  private async initializeRoutes(): Promise<void> {
    const routeFiles = await getAllFiles('/routes');

    routeFiles.forEach((file) => {
      const routeClass = require(path.resolve(__dirname, file)).default;
      const route = new routeClass();

      this.app.use(`/api/v1${route.path}`, route.getRouter());
    });

    this.app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(SwaggerJSDoc));
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
