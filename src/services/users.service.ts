import { PrismaClient, User } from '@prisma/client';

import { isEmpty } from '@utils/isEmpty.util';
import { HttpException } from '@helpers/httpException.helper';
import { EncryptHelper } from '@helpers/encrypt.helper';

export default class UsersService {
  private prismaService: PrismaClient;
  private encryptHelper: EncryptHelper;
  private users: PrismaClient['user'];

  constructor() {
    this.prismaService = new PrismaClient();
    this.encryptHelper = new EncryptHelper();

    this.users = this.prismaService.user;
  }

  public async findAllUsers(): Promise<User[]> {
    const getAllUsers: User[] = await this.users.findMany();
    getAllUsers.forEach((user) => delete user.password);

    return getAllUsers;
  }

  public async findUserById(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'User ID is required');

    const findUserById: User = await this.users.findUnique({ where: { id: userId } }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    if (!findUserById) throw new HttpException(409, 'User not found');
    delete findUserById.password;

    return findUserById;
  }

  public async createUser(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail: User = await this.users.findUnique({ where: { email: userData.email } });
    if (findUserByEmail) throw new HttpException(409, `Email ${userData.email} already exists`);

    const hashedPassword = await this.encryptHelper.hashPassword(userData.password);
    const createUser: User = await this.users.create({ data: { ...userData, password: hashedPassword } }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    delete createUser.password;

    return createUser;
  }

  public async updateUser(userId: number, userData: User): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'User ID is required');
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserById: User = await this.users.findUnique({ where: { id: userId } }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    if (!findUserById) throw new HttpException(409, 'User not found');

    const updateUserById: User = await this.users.update({ where: { id: userId }, data: userData }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    delete updateUserById.password;

    return updateUserById;
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isEmpty(userId)) throw new HttpException(400, 'User ID is required');

    const findUserById: User = await this.users.findUnique({ where: { id: userId } }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    if (!findUserById) throw new HttpException(409, 'User not found');

    const deleteUserById: User = await this.users.delete({ where: { id: userId } }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    delete deleteUserById.password;

    return deleteUserById;
  }
}
