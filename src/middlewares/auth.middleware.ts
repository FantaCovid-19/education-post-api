import { Request, Response, NextFunction } from 'express';

import AuthService from '../services/auth.service';
import { JwtHelper } from '../helpers/jwt.helper';
import { HttpException } from '../helpers/httpException.helper';

class AuthMiddleware {
  private authService: AuthService = new AuthService();
  private jwtHelper: JwtHelper = new JwtHelper();

  private getAutorization = (req: Request): string => {
    const { authorization } = req.headers;
    return authorization!.split('Bearer ')[1];
  };

  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies['refreshToken'] ?? '';
      if (!refreshToken) next(new HttpException(401, 'Unauthorized refresh token missing'));

      res.setHeader('Set-Cookie', ['refreshToken=; Max-age=0']);

      const refreshVerify: any = this.jwtHelper.verifyToken(refreshToken);
      if (!refreshVerify) next(new HttpException(401, 'Unauthorized refresh token invalid'));

      const findUserById = await this.authService.getUserByTokenId(refreshVerify.id);
      if (!findUserById) next(new HttpException(401, 'Unauthorized refresh token invalid'));

      const isTokenValid = findUserById.refreshToken && refreshToken && findUserById.refreshToken === refreshToken;
      if (!isTokenValid) {
        await this.authService.updateUserRefreshToken(findUserById.id, null);
        next(new HttpException(401, 'Unauthorized refresh token invalid'));
      }

      req.user = findUserById;
      next();
    } catch (error) {
      next(new HttpException(401, 'Invalid refresh token'));
    }
  };

  public verifyUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const Autorization = this.getAutorization(req);
      if (!Autorization) next(new HttpException(401, 'Unauthorized token missing'));

      const decoded: any = this.jwtHelper.verifyToken(Autorization);
      if (!decoded) next(new HttpException(401, 'Unauthorized token invalid'));

      const findUserById = await this.authService.getUserByTokenId(decoded.id);
      if (!findUserById) next(new HttpException(401, 'Wrong authentication token'));

      req.user = findUserById;
      next();
    } catch (error) {
      next(new HttpException(401, 'Unauthorized token invalid'));
    }
  };

  public verifyAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const Autorization = this.getAutorization(req);
      if (!Autorization) next(new HttpException(401, 'Unauthorized token missing'));

      const decoded: any = this.jwtHelper.verifyToken(Autorization);
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

export { AuthMiddleware };
