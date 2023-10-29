import { getAllFiles } from '@utils/getFiles.util';
import { Router } from 'express';

export default class IndexRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.loadRoutes();
  }

  private async loadRoutes() {
    const pathRoutes: string[] = getAllFiles('src/routes');

    for (const path of pathRoutes) {
      const routeName = path.split('src\\routes\\')[1];
      if (routeName === 'index.route.ts') continue;

      const routeImport = (await import(`@routes/${routeName}`)).default || require(`${path}`).default;
      const routeClass = new routeImport();

      this.router.use(routeClass.path, routeClass.getRouter());
    }
  }

  public getRouter(): Router {
    return this.router;
  }
}
