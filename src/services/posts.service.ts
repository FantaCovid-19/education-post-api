import { db } from '../utils/db.util';
import { isEmpty } from '../utils/isEmpty.util';
import { HttpException } from '../helpers/httpException.helper';

export default class PostsService {
  private posts = db.post;

  public async findAllPosts(): Promise<any> {
    const getAllPosts = await this.posts.findMany();
    return getAllPosts;
  }

  public async findPostById(postId: number): Promise<any> {
    if (isEmpty(postId)) throw new HttpException(400, 'Post ID is required');

    const findPostById = await this.posts.findUnique({ where: { id: postId } }).catch(() => {
      throw new HttpException(400, 'Post ID is invalid');
    });
    if (!findPostById) throw new HttpException(409, 'Post not found');

    return findPostById;
  }

  public async createPost(postData: any): Promise<any> {
    if (isEmpty(postData)) throw new HttpException(400, 'Post data is required');

    const createPost = await this.posts.create({ data: postData }).catch(() => {
      throw new HttpException(409, 'Author or post not found');
    });

    return createPost;
  }

  public async updatePost(postId: number, postData: any): Promise<any> {
    if (isEmpty(postId)) throw new HttpException(400, 'Post ID is required');
    if (isEmpty(postData)) throw new HttpException(400, 'Post data is required');

    const findPostById = await this.posts.findUnique({ where: { id: postId } }).catch(() => {
      throw new HttpException(409, 'Author or post not found');
    });
    if (!findPostById) throw new HttpException(409, 'Post not found');

    const updatePostById = await this.posts.update({ where: { id: postId }, data: postData }).catch(() => {
      throw new HttpException(409, 'Author or post not found');
    });

    return updatePostById;
  }

  public async deletePost(postId: number): Promise<any> {
    if (isEmpty(postId)) throw new HttpException(400, 'Post ID is required');

    const findPostById = await this.posts.findUnique({ where: { id: postId } }).catch(() => {
      throw new HttpException(409, 'Author or post not found');
    });
    if (!findPostById) throw new HttpException(409, 'Post not found');

    const deletePostById = await this.posts.delete({ where: { id: postId } }).catch(() => {
      throw new HttpException(409, 'Author or post not found');
    });

    return deletePostById;
  }
}
