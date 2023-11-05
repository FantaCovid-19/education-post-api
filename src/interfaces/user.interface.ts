interface getUserQuery {
  page?: number;
  limit?: number;
}

interface getAllUsers {
  getAllUsers: User[];
  currentPage: number;
  getAllUsersCount: number;
  totalCount: number;
  totalPages: number;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
}

interface UserCreate {
  name: string;
  email: string;
  password: string;
}

interface UserUpdate {
  name?: string;
  email?: string;
}

interface UserDelete {
  id: string;
}

export { getUserQuery, getAllUsers, User, UserCreate, UserUpdate, UserDelete };
