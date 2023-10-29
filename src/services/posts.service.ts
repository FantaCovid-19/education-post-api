import { PrismaClient, Post } from '@prisma/client';

import { isEmpty } from '@utils/isEmpty.util';
import { HttpException } from '@helpers/httpException.helper';

export default class PostsService {
  private prismaService: PrismaClient;
  private posts: PrismaClient['post'];

  constructor() {
    this.prismaService = new PrismaClient();
    this.posts = this.prismaService.post;
  }

  public async findAllPosts(): Promise<Post[]> {
    const getAllPosts: Post[] = await this.posts.findMany();
    return getAllPosts;
  }

  public async findPostById(postId: number): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'Post ID is required');

    const findPostById: Post = await this.posts.findUnique({ where: { id: postId } }).catch(() => {
      throw new HttpException(400, 'Post ID is invalid');
    });
    if (!findPostById) throw new HttpException(409, 'Post not found');

    return findPostById;
  }

  public async createPost(postData: Post): Promise<Post> {
    if (isEmpty(postData)) throw new HttpException(400, 'Post data is required');

    const createPost: Post = await this.posts.create({ data: postData }).catch(() => {
      throw new HttpException(409, 'Author or post not found');
    });

    return createPost;
  }

  public async updatePost(postId: number, postData: Post): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'Post ID is required');
    if (isEmpty(postData)) throw new HttpException(400, 'Post data is required');

    const findPostById: Post = await this.posts.findUnique({ where: { id: postId } }).catch(() => {
      throw new HttpException(409, 'Author or post not found');
    });
    if (!findPostById) throw new HttpException(409, 'Post not found');

    const updatePostById: Post = await this.posts.update({ where: { id: postId }, data: postData }).catch(() => {
      throw new HttpException(409, 'Author or post not found');
    });

    return updatePostById;
  }

  public async deletePost(postId: number): Promise<Post> {
    if (isEmpty(postId)) throw new HttpException(400, 'Post ID is required');

    const findPostById: Post = await this.posts.findUnique({ where: { id: postId } }).catch(() => {
      throw new HttpException(409, 'Author or post not found');
    });
    if (!findPostById) throw new HttpException(409, 'Post not found');

    const deletePostById: Post = await this.posts.delete({ where: { id: postId } }).catch(() => {
      throw new HttpException(409, 'Author or post not found');
    });

    return deletePostById;
  }
}
