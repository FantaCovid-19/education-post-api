import express, { Application } from 'express';
import SwaggerUI from 'swagger-ui-express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import hpp from 'hpp';

import { PORT, NODE_ENV, API_URL, SESSION_SECRET } from '../configs';
import { loggerUtils } from '../utils/logger.util';
import { errorMiddleware } from '../middlewares/error.middleware';
import { swaggerJSDoc } from '../docs/swagger';
import Routes from '../routes';

declare module 'express' {
  interface Request {
    user?: any;
  }
}

declare module 'express-session' {
  interface SessionData {}
}

class App {
  private app: Application;
  private env: string;
  private port: string | number;

  constructor() {
    this.app = express();
    this.env = NODE_ENV;
    this.port = PORT;

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

  private initializeConfigure(): void {
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(compression());

    this.app.use(cors());
    this.app.options('*', cors());

    this.app.set('trust proxy', 1);
    this.app.disable('x-powered-by');

    this.app.use(morgan('dev', { stream: loggerUtils.stream() }));

    this.app.use(hpp());
    this.app.use(cookieParser());
    this.app.use(
      session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { sameSite: 'strict', secure: Boolean(this.env === 'production') }
      })
    );
  }

  private async initializeRoutes(): Promise<void> {
    const routes = new Routes();

    this.app.use(routes.path, routes.getRouter());
    this.app.use('/api-docs', SwaggerUI.serve, SwaggerUI.setup(swaggerJSDoc));
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

export default App;
