import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';

import AuthService from '@services/auth.service';
import { JwtHelper } from '@helpers/jwt.helper';
import { HttpException } from '@helpers/httpException.helper';

export interface RequestWithUser extends Request {
  user: User;
}

export default class AuthMiddleware {
  private authService: AuthService;
  private jwtHelper: JwtHelper;

  constructor() {
    this.authService = new AuthService();
    this.jwtHelper = new JwtHelper();
  }

  private getAutorization = (req: Request): string => {
    return req.header('Authorization').split('Bearer ')[1] ?? '';
  };

  public verifyUser = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const Autorization = this.getAutorization(req);
      if (!Autorization) next(new HttpException(401, 'Unauthorized token missing'));

      const decoded: any = await this.jwtHelper.verifyToken(Autorization);
      if (!decoded) next(new HttpException(401, 'Unauthorized token invalid'));

      const findUserById = await this.authService.getUserByTokenId(decoded.id);
      if (!findUserById) next(new HttpException(401, 'Wrong authentication token'));

      req.user = findUserById;
      next();
    } catch (error) {
      next(new HttpException(401, 'Unauthorized token invalid'));
    }
  };

  public verifyAdmin = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const Autorization = this.getAutorization(req);
      if (!Autorization) next(new HttpException(401, 'Unauthorized token missing'));

      const decoded: any = await this.jwtHelper.verifyToken(Autorization);
      if (!decoded) next(new HttpException(401, 'Unauthorized token invalid'));

      const findUserById = await this.authService.getUserByTokenId(decoded.id);
      if (!findUserById) next(new HttpException(401, 'Wrong authentication token'));

      if (findUserById.role === 'USER') next(new HttpException(401, 'Unauthorized role'));

      req.user = findUserById;
      next();
    } catch (error) {
      next(new HttpException(401, 'Unauthorized token invalid'));
    }
  };
}
