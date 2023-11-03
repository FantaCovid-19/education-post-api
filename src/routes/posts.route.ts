import { Router } from 'express';
import { BaseRoute } from '../interfaces/baseRoute.interface';

import PostsController from '../controllers/posts.controller';
import AuthMiddleware from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validator.middleware';
import { postCreateValidationRules, postUpateValidationRules, postDeleteValidationRules } from '../validations/posts.validation';

export default class PostsRoute extends BaseRoute {
  private postsController: PostsController = new PostsController();
  private authMiddleware: AuthMiddleware = new AuthMiddleware();

  constructor() {
    super('/posts');
    this.initializeRoutes();
  }

  initializeRoutes(): void {
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
