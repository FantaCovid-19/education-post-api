import { db } from '../utils/db.util';
import { isEmpty } from '../utils/isEmpty.util';
import { HttpException } from '../helpers/httpException.helper';
import { EncryptHelper } from '../helpers/encrypt.helper';

export default class UsersService {
  private users = db.user;
  private encryptHelper: EncryptHelper;

  constructor() {
    this.encryptHelper = new EncryptHelper();
  }

  public async findAllUsers(): Promise<any[]> {
    const getAllUsers = await this.users.findMany();
    getAllUsers.forEach((user: any) => delete user.password);

    return getAllUsers;
  }

  public async findUserById(userId: number): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 'User ID is required');

    const findUserById: any = await this.users.findUnique({ where: { id: userId } }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    if (!findUserById) throw new HttpException(409, 'User not found');
    delete findUserById.password;

    return findUserById;
  }

  public async createUser(userData: any): Promise<any> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail = await this.users.findUnique({ where: { email: userData.email } });
    if (findUserByEmail) throw new HttpException(409, `Email ${userData.email} already exists`);

    const hashedPassword = await this.encryptHelper.hashPassword(userData.password);
    const createUser: any = await this.users.create({ data: { ...userData, password: hashedPassword } }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    delete createUser.password;

    return createUser;
  }

  public async updateUser(userId: number, userData: any): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 'User ID is required');
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserById = await this.users.findUnique({ where: { id: userId } }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    if (!findUserById) throw new HttpException(409, 'User not found');

    const updateUserById: any = await this.users.update({ where: { id: userId }, data: userData }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    delete updateUserById.password;

    return updateUserById;
  }

  public async deleteUser(userId: number): Promise<any> {
    if (isEmpty(userId)) throw new HttpException(400, 'User ID is required');

    const findUserById = await this.users.findUnique({ where: { id: userId } }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    if (!findUserById) throw new HttpException(409, 'User not found');

    const deleteUserById: any = await this.users.delete({ where: { id: userId } }).catch(() => {
      throw new HttpException(409, 'User not found');
    });
    delete deleteUserById.password;

    return deleteUserById;
  }
}
