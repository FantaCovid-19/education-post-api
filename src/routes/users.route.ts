import { Router } from 'express';

import UsersController from '@controllers/users.controller';
import AuthMiddleware from '@middlewares/auth.middleware';
import { validate } from '@helpers/validator.helper';
import { userCreateValidationRules, userUpateValidationRules, userDeleteValidationRules } from '@validations/users.validation';

export default class UsersRoute {
  public router: Router;
  public path: string;

  private usersController: UsersController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.path = '/users';

    this.usersController = new UsersController();
    this.authMiddleware = new AuthMiddleware();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    // @ts-expect-error
    this.router.get('/', this.authMiddleware.verifyAdmin, this.usersController.getAllUsers);
    // @ts-expect-error
    this.router.get('/:id', this.authMiddleware.verifyAdmin, this.usersController.getUserById);
    // @ts-expect-error
    this.router.post('/', this.authMiddleware.verifyAdmin, userCreateValidationRules(), validate, this.usersController.createUser);
    // @ts-expect-error
    this.router.put('/:id', this.authMiddleware.verifyAdmin, userUpateValidationRules(), validate, this.usersController.updateUser);
    // @ts-expect-error
    this.router.delete('/:id', this.authMiddleware.verifyAdmin, userDeleteValidationRules(), validate, this.usersController.deleteUser);
  }

  public getRouter(): Router {
    return this.router;
  }
}
