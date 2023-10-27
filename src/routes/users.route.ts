import { Router } from 'express';

import UsersController from '@controllers/users.controller';

export default class UsersRoute {
  public router: Router;
  public path: string;

  private usersController = new UsersController();

  constructor() {
    this.router = Router();
    this.path = '/users';

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.usersController.getAllUsers);
    this.router.get('/:id', this.usersController.getUserById);
    this.router.post('/', this.usersController.createUser);
    this.router.put('/:id', this.usersController.updateUser);
    this.router.delete('/:id', this.usersController.deleteUser);
  }

  public getRouter(): Router {
    return this.router;
  }
}
