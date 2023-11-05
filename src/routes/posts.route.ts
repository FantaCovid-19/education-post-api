import { Router } from 'express';
import { BaseRoute } from '../interfaces/baseRoute.interface';

import PostsController from '../controllers/posts.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validator.middleware';
import { postGetAllValidationRules, postGetByIdValidationRules, postCreateValidationRules, postUpateValidationRules, postDeleteValidationRules } from '../validations/posts.validation';

export default class PostsRoute extends BaseRoute {
  private postsController: PostsController = new PostsController();
  private authMiddleware: AuthMiddleware = new AuthMiddleware();

  constructor() {
    super('/posts');
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.router.get('/', postGetAllValidationRules(), validate, this.postsController.getAllPosts);
    this.router.get('/:id', postGetByIdValidationRules(), validate, this.postsController.getPostById);
    this.router.post('/', this.authMiddleware.verifyUser, postCreateValidationRules(), validate, this.postsController.createPost);
    this.router.put('/:id', this.authMiddleware.verifyUser, postUpateValidationRules(), validate, this.postsController.updatePost);
    this.router.delete('/:id', this.authMiddleware.verifyUser, postDeleteValidationRules(), validate, this.postsController.deletePost);
  }

  public getRouter(): Router {
    return this.router;
  }
}
