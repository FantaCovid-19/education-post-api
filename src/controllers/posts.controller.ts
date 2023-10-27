import type { Request, Response, NextFunction } from 'express';
import { Post } from '@prisma/client';

import PostsService from '@services/posts.service';

export default class PostsController {
  private postsService: PostsService = new PostsService();

  public getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const allPostsData: Post[] = await this.postsService.findAllPosts();

      res.status(200).json({ data: allPostsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId: number = Number(req.params.id);
      const findPostData: Post = await this.postsService.findPostById(postId);

      res.status(200).json({ data: findPostData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postData: Post = req.body;
      const createPostData: Post = await this.postsService.createPost(postData);

      res.status(201).json({ data: createPostData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId: number = Number(req.params.id);
      const postData: Post = req.body;
      const updatePostData: Post = await this.postsService.updatePost(postId, postData);

      res.status(200).json({ data: updatePostData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId: number = Number(req.params.id);
      const deletePostData: Post = await this.postsService.deletePost(postId);

      res.status(200).json({ data: deletePostData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
