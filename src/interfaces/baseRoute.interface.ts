import { Router } from 'express';

export abstract class BaseRoute {
  path: string;
  router: Router;

  constructor(path: string) {
    this.path = path;
    this.router = Router();
  }

  abstract initializeRoutes(): void;
}
