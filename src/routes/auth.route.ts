import { Router } from 'express';

import AuthController from '@controllers/auth.controller';

export default class AuthRoute {
  public router: Router;
  public path: string;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.path = '/auth';
    this.authController = new AuthController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signUp', this.authController.signUp);
    this.router.post('/signIn', this.authController.signIn);
    this.router.post('/signOut', this.authController.signOut);
  }

  public getRouter(): Router {
    return this.router;
  }
}
