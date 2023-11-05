import { prisma } from '../utils/prisma.util';
import { HttpException } from '../helpers/httpException.helper';
import { EncryptHelper } from '../helpers/encryption.helper';
import { getUserQuery, getAllUsers, User, UserCreate, UserUpdate, UserDelete } from '../interfaces/user.interface';

export default class UsersService {
  private encryptHelper: EncryptHelper = new EncryptHelper();

  public async findAllUsers(query: getUserQuery): Promise<getAllUsers> {
    const { page, limit } = query;
    const pageSkip = page ? +page : 1;
    const pageLimit = limit ? +limit : 5;
    const startIndex = (pageSkip - 1) * pageLimit;
    const totalCount = await prisma.user.count();
    const totalPages = Math.ceil(totalCount / pageLimit);
    const currentPage = pageSkip > totalPages ? totalPages : pageSkip;

    if (pageSkip < 1) throw new HttpException(400, 'Page must be greater than 0');
    if (pageLimit < 1) throw new HttpException(400, 'Limit must be greater than 0');

    const getAllUsers = await prisma.user.findMany({
      skip: startIndex,
      take: pageLimit,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    const getAllUsersCount = getAllUsers.length;
    if (!getAllUsers) throw new HttpException(409, 'Users not found');
    if (getAllUsers.length < 1) throw new HttpException(409, 'Users not found');

    return { getAllUsers, currentPage, getAllUsersCount, totalCount, totalPages };
  }

  public async findUserById(userId: string): Promise<User> {
    if (userId) throw new HttpException(400, 'User ID is required');

    const findUserById: any = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });
    if (!findUserById) throw new HttpException(409, 'User not found');

    return findUserById;
  }

  public async createUser(userData: UserCreate): Promise<User> {
    if (!userData) throw new HttpException(400, 'User data is required');

    const findUserByEmail = await prisma.user.findUnique({ where: { email: userData.email } });
    if (findUserByEmail) throw new HttpException(409, `Email ${userData.email} already exists`);

    const hashedPassword = this.encryptHelper.hashPassword(userData.password);
    const createUser = await prisma.user.create({
      data: { ...userData, password: hashedPassword },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    return createUser;
  }

  public async updateUser(userId: string, userData: UserUpdate): Promise<User> {
    if (!userId) throw new HttpException(400, 'User ID is required');
    if (!userData) throw new HttpException(400, 'User data is required');

    const findUserById = await prisma.user.findUnique({ where: { id: userId } });
    if (!findUserById) throw new HttpException(409, 'User not found');

    const updateUserById = await prisma.user.update({
      where: { id: userId },
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    return updateUserById;
  }

  public async deleteUser(userId: string): Promise<UserDelete> {
    if (!userId) throw new HttpException(400, 'User ID is required');

    const findUserById = await prisma.user.findUnique({ where: { id: userId } });
    if (!findUserById) throw new HttpException(409, 'User not found');

    const deleteUserById = await prisma.user.delete({ where: { id: userId }, select: { id: true } });

    return deleteUserById;
  }
}
