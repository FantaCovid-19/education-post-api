import { Router } from 'express';

export interface IRouter {
  path: string;
  router: Router;
}

export abstract class BaseRoute {
  path: string;
  router: Router;

  constructor(path: string) {
    this.path = path;
    this.router = Router();
  }

  abstract initializeRoutes(): void;
}
