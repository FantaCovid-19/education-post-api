import type { Request, Response, NextFunction } from 'express';

import AuthService from '../services/auth.service';
import { SignUpInput, SignInInput } from '../interfaces/auth.interface';

export default class AuthController {
  private authService: AuthService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: SignUpInput = req.body;

      const signUpUserData = await this.authService.signUp(userData);
      const publicUserData = this.authService.getPublicUserData(signUpUserData);

      res.status(201).json({ data: publicUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: SignInInput = req.body;
      const { signInData, accessToken, cookie } = await this.authService.signIn(userData);
      const publicUserData = this.authService.getPublicUserData(signInData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: { user: publicUserData, accessToken }, message: 'signin' });
    } catch (error) {
      next(error);
    }
  };

  public signOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.user;
      const signOutUserData = await this.authService.signOut(userData);

      res.setHeader('Set-Cookie', ['refresh_token=; Max-age=0']);
      res.status(200).json({ data: signOutUserData, message: 'signout' });
    } catch (error) {
      next(error);
    }
  };
}
