import { Router } from 'express';
import { BaseRoute } from '../interfaces/baseRoute.interface';

import UsersController from '../controllers/users.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validator.middleware';
import { userCreateValidationRules, userUpateValidationRules, userDeleteValidationRules, userGetAllValidationRules, userGetByIdValidationRules } from '../validations/users.validation';

export default class UsersRoute extends BaseRoute {
  private usersController: UsersController = new UsersController();
  private authMiddleware: AuthMiddleware = new AuthMiddleware();

  constructor() {
    super('/users');
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get('/', this.authMiddleware.verifyAdmin, userGetAllValidationRules(), validate, this.usersController.getAllUsers);
    this.router.get('/:id', this.authMiddleware.verifyAdmin, userGetByIdValidationRules(), validate, this.usersController.getUserById);
    this.router.post('/', this.authMiddleware.verifyAdmin, userCreateValidationRules(), validate, this.usersController.createUser);
    this.router.put('/:id', this.authMiddleware.verifyAdmin, userUpateValidationRules(), validate, this.usersController.updateUser);
    this.router.delete('/:id', this.authMiddleware.verifyAdmin, userDeleteValidationRules(), validate, this.usersController.deleteUser);
  }

  public getRouter(): Router {
    return this.router;
  }
}
