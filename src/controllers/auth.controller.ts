import type { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';

import AuthService from '@services/auth.service';

export default class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const signUpUserData: User = await this.authService.signUp(userData);
      const publicUserData = this.authService.getPublicUserData(signUpUserData);

      res.status(201).json({ data: publicUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public signIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const { findUserByEmail, accessToken }: any = await this.authService.signIn(userData);
      const signInUserData = this.authService.getPublicUserData(findUserByEmail);

      res.status(200).json({ data: { user: signInUserData, accessToken }, message: 'signin' });
    } catch (error) {
      next(error);
    }
  };

  public signOut = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const signOutUserData: User = await this.authService.signOut(userData);

      res.status(200).json({ data: signOutUserData, message: 'signout' });
    } catch (error) {
      next(error);
    }
  };
}
