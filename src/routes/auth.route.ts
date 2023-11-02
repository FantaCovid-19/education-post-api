import { Router } from 'express';
import { BaseRoute } from '../interfaces/router.interface';

import AuthController from '../controllers/auth.controller';
import { validate } from '../helpers/validator.helper';
import { signInValidationRules, signUpValidationRules } from '../validations/auth.validation';

export default class AuthRoute extends BaseRoute {
  private authController: AuthController = new AuthController();

  constructor() {
    super('/auth');
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.post('/signup', signUpValidationRules(), validate, this.authController.signUp);
    this.router.post('/signin', signInValidationRules(), validate, this.authController.signIn);
    this.router.post('/signout', this.authController.signOut);
  }

  public getRouter(): Router {
    return this.router;
  }
}
