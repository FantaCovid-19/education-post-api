import { Request, Response, NextFunction } from 'express';

import { HttpException } from '../helpers/httpException.helper';
import { loggerUtils } from '../utils/logger.util';

class ErrorMiddleware {
  public httpExceptionError = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
      const status: number = error.statusCode || 500;
      const message: string = error.message || 'Something went wrong';

      loggerUtils.error(`[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`);
      res.status(status).json({ message });
    } catch (error) {
      next(error);
    }
  };
}

const errorMiddleware = new ErrorMiddleware().httpExceptionError;
export { errorMiddleware };
