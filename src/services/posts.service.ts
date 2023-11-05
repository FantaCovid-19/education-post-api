import { prisma } from '../utils/prisma.util';
import { HttpException } from '../helpers/httpException.helper';
import { getPostQuery, getAllPosts, Post, PostCreate, PostUpdate, PostDelete } from '../interfaces/post.interface';

class PostsService {
  public async findAllPosts(query: getPostQuery): Promise<getAllPosts> {
    const { page, limit } = query;
    const pageSkip = page ? +page : 1;
    const pageLimit = limit ? +limit : 5;
    const startIndex = (pageSkip - 1) * pageLimit;
    const totalCount = await prisma.post.count();
    const totalPages = Math.ceil(totalCount / pageLimit);
    const currentPage = pageSkip > totalPages ? totalPages : pageSkip;

    if (pageSkip < 1) throw new HttpException(400, 'Page must be greater than 0');
    if (pageLimit < 1) throw new HttpException(400, 'Limit must be greater than 0');

    const getAllPosts = await prisma.post.findMany({
      skip: startIndex,
      take: pageLimit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        published: true,
        content: true,
        author: { select: { id: true, name: true } },
        createdAt: true
      }
    });
    const getAllPostsCount = getAllPosts.length;
    if (!getAllPosts) throw new HttpException(409, 'Posts not found');
    if (getAllPostsCount < 1) throw new HttpException(409, 'Posts not found');

    return { getAllPosts, currentPage, getAllPostsCount, totalCount, totalPages };
  }

  public async findPostById(postId: string): Promise<Post> {
    if (!postId) throw new HttpException(400, 'Post ID is required');

    const findPostById = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        title: true,
        published: true,
        content: true,
        author: { select: { id: true, name: true } },
        createdAt: true
      }
    });
    if (!findPostById) throw new HttpException(409, 'Post not found');

    return findPostById;
  }

  public async createPost(postData: PostCreate): Promise<Post> {
    if (!postData) throw new HttpException(400, 'Post data is required');

    const findAuthorById = await prisma.user.findUnique({ where: { id: postData.authorId }, select: { id: true } });
    if (!findAuthorById) throw new HttpException(409, 'Author not found');

    const createPost = await prisma.post.create({
      data: postData,
      select: {
        id: true,
        title: true,
        published: true,
        content: true,
        author: { select: { id: true, name: true } },
        createdAt: true
      }
    });

    return createPost;
  }

  public async updatePost(postId: string, postData: PostUpdate): Promise<Post> {
    if (!postId) throw new HttpException(400, 'Post ID is required');
    if (!postData) throw new HttpException(400, 'Post data is required');

    const findPostById = await prisma.post.findUnique({ where: { id: postId } });
    if (!findPostById) throw new HttpException(409, 'Post not found');

    const updatePostById = await prisma.post.update({
      where: { id: postId },
      data: postData,
      select: {
        id: true,
        title: true,
        published: true,
        content: true,
        author: { select: { id: true, name: true } },
        createdAt: true
      }
    });

    return updatePostById;
  }

  public async deletePost(postId: string): Promise<PostDelete> {
    if (!postId) throw new HttpException(400, 'Post ID is required');

    const findPostById = await prisma.post.findUnique({ where: { id: postId } });
    if (!findPostById) throw new HttpException(409, 'Post not found');

    const deletePostById = await prisma.post.delete({ where: { id: postId }, select: { id: true } });

    return deletePostById;
  }
}

export default PostsService;
