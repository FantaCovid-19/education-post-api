import type { Request, Response, NextFunction } from 'express';
import PostsService from '../services/posts.service';

class PostsController {
  private postsService: PostsService = new PostsService();

  public getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query: any = req.query;
      const { getAllPosts, totalCount, totalPages, currentPage, getAllPostsCount } = await this.postsService.findAllPosts(query);

      res.status(200).json({
        data: getAllPosts,
        message: 'findAll',
        currentPage,
        getAllPostsCount,
        totalCount,
        totalPages
      });
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const findPostData = await this.postsService.findPostById(id);

      res.status(200).json({
        data: findPostData,
        message: 'findOne'
      });
    } catch (error) {
      next(error);
    }
  };

  public createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postData = req.body;
      const createPostData = await this.postsService.createPost(postData);

      res.status(201).json({
        data: createPostData,
        message: 'created'
      });
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const postData = req.body;
      const updatePostData = await this.postsService.updatePost(id, postData);

      res.status(200).json({
        data: updatePostData,
        message: 'updated'
      });
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deletePostData = await this.postsService.deletePost(id);

      res.status(200).json({
        data: deletePostData,
        message: 'deleted'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default PostsController;
