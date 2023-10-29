import { PrismaClient, User } from '@prisma/client';

import { isEmpty } from '@utils/isEmpty.util';
import { JwtHelper } from '@helpers/jwt.helper';
import { EncryptHelper } from '@helpers/encrypt.helper';
import { HttpException } from '@helpers/httpException.helper';

export default class AuthService {
  private prisma: PrismaClient;
  private jwtHelper: JwtHelper;
  private encryptHelper: EncryptHelper;
  private users: PrismaClient['user'];

  constructor() {
    this.prisma = new PrismaClient();
    this.jwtHelper = new JwtHelper();
    this.encryptHelper = new EncryptHelper();

    this.users = this.prisma.user;
  }

  public async signUp(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail: User = await this.users.findUnique({ where: { email: userData.email } });
    if (findUserByEmail) throw new HttpException(409, `Email ${userData.email} already exists`);

    const hashedPassword = await this.encryptHelper.hashPassword(userData.password);
    const createUser: User = await this.users.create({ data: { ...userData, password: hashedPassword } });

    return createUser;
  }

  public async signIn(userData: User): Promise<object> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail: User = await this.users.findUnique({ where: { email: userData.email } });
    if (!findUserByEmail) throw new HttpException(409, `Email ${userData.email} not found`);

    const isPasswordMatching: boolean = await this.encryptHelper.comparePassword(userData.password, findUserByEmail.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is incorrect');

    const { accessToken, refreshToken } = await this.generateToken(findUserByEmail);

    return { findUserByEmail, accessToken, refreshToken };
  }

  public async signOut(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail: User = await this.users.findFirst({ where: { id: userData.id } });
    if (!findUserByEmail) throw new HttpException(409, `User not found`);

    return findUserByEmail;
  }

  public createAccessToken(userData: User) {
    const dataStoredInToken = { id: userData.id };
    const expiresIn: number = 600;

    return { expiresIn, token: this.jwtHelper.signToken(dataStoredInToken, expiresIn) };
  }

  public createRefreshToken(userData: User) {
    const dataStoredInToken = { id: userData.id };
    const expiresIn: number = 3600;

    return { expiresIn, token: this.jwtHelper.signToken(dataStoredInToken, expiresIn) };
  }

  public async generateToken(userData: User) {
    const accessToken = this.createAccessToken(userData);
    const refreshToken = this.createRefreshToken(userData);

    return { accessToken, refreshToken };
  }

  public async getUserByTokenId(userId: number | string): Promise<User> {
    const findUserById: User = await this.users.findUnique({ where: { id: Number(userId) } });
    findUserById.password = undefined;

    return findUserById;
  }

  public getPublicUserData(userData: User) {
    const publicData = {
      email: userData.email,
      role: userData.role
    };

    return publicData;
  }
}
