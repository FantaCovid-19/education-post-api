import { Router } from 'express';

import PostsController from '@controllers/posts.controller';
import AuthMiddleware from '@middlewares/auth.middleware';
import { validate } from '@helpers/validator.helper';
import { postCreateValidationRules, postUpateValidationRules, postDeleteValidationRules } from '@validations/posts.validation';

export default class PostsRoute {
  public router: Router;
  public path: string;

  private postsController: PostsController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.path = '/posts';

    this.postsController = new PostsController();
    this.authMiddleware = new AuthMiddleware();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.postsController.getAllPosts);
    this.router.get('/:id', this.postsController.getPostById);
    // @ts-expect-error
    this.router.post('/', this.authMiddleware.verifyUser, postCreateValidationRules(), validate, this.postsController.createPost);
    // @ts-expect-error
    this.router.put('/:id', this.authMiddleware.verifyUser, postUpateValidationRules(), validate, this.postsController.updatePost);
    // @ts-expect-error
    this.router.delete('/:id', this.authMiddleware.verifyUser, postDeleteValidationRules(), validate, this.postsController.deletePost);
  }

  public getRouter(): Router {
    return this.router;
  }
}
