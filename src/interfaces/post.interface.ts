interface getPostQuery {
  page?: number;
  limit?: number;
}

interface getAllPosts {
  getAllPosts: Post[];
  currentPage: number;
  getAllPostsCount: number;
  totalCount: number;
  totalPages: number;
}

interface Post {
  id: string;
  title: string;
  published: boolean;
  content: string;
  author: { id: string; name: string | null } | null;
  createdAt: Date;
}

interface PostCreate {
  title: string;
  published?: boolean;
  content: string;
  authorId: string;
}

interface PostUpdate {
  title?: string;
  published?: boolean;
  content?: string;
}

interface PostDelete {
  id: string;
}

export { getPostQuery, getAllPosts, Post, PostCreate, PostUpdate, PostDelete };
