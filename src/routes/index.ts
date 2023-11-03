import { Router } from 'express';
import path from 'path';

import { BaseRoute } from '../interfaces/baseRoute.interface';
import { getAllFiles } from '../utils/getAllFiles.util';

class Routes extends BaseRoute {
  constructor() {
    super('/api/v1');
    this.initializeRoutes();
  }

  async initializeRoutes(): Promise<void> {
    const routeFiles = await getAllFiles('/routes');

    for (const file of routeFiles) {
      if (file.split('\\').pop() === 'index.ts') continue;

      const routeClass = require(path.resolve(__dirname, file)).default;
      const route = new routeClass();

      this.router.use(route.path, route.router);
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}

export default Routes;
