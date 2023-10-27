import { Router } from 'express';

import PostsController from '@controllers/posts.controller';

export default class PostsRoute {
  public router: Router;
  public path: string;
  private postsController: PostsController;

  constructor() {
    this.router = Router();
    this.path = '/posts';
    this.postsController = new PostsController();

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', this.postsController.getAllPosts);
    this.router.get('/:id', this.postsController.getPostById);
    this.router.post('/', this.postsController.createPost);
    this.router.put('/:id', this.postsController.updatePost);
    this.router.delete('/:id', this.postsController.deletePost);
  }

  public getRouter(): Router {
    return this.router;
  }
}
