import { PrismaClient, User } from '@prisma/client';

import { isEmpty } from '@utils/isEmpty.util';
import { JwtHelper } from '@helpers/jwt.helper';
import { EncryptHelper } from '@helpers/encrypt.helper';
import { HttpException } from '@helpers/httpException.helper';

export default class AuthService {
  private prisma: PrismaClient = new PrismaClient();
  private users = this.prisma.user;

  private jwtHelper: JwtHelper = new JwtHelper();
  private encryptHelper: EncryptHelper = new EncryptHelper();

  public async signUp(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail: User = await this.users.findUnique({ where: { email: userData.email } });
    if (findUserByEmail) throw new HttpException(409, `Email ${userData.email} already exists`);

    const hashedPassword = await this.encryptHelper.hashPassword(userData.password, 10);
    const createUser: User = await this.users.create({ data: { ...userData, password: hashedPassword } });

    return createUser;
  }

  public async signIn(userData: User): Promise<object> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail: User = await this.users.findUnique({ where: { email: userData.email } });
    if (!findUserByEmail) throw new HttpException(409, `Email ${userData.email} not found`);

    const isPasswordMatching: boolean = await this.encryptHelper.comparePassword(userData.password, findUserByEmail.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is incorrect');

    const tokenData = this.generateToken(findUserByEmail);

    return tokenData;
  }

  public async signOut(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail: User = await this.users.findUnique({ where: { email: userData.email } });
    if (!findUserByEmail) throw new HttpException(409, `Email ${userData.email} not found`);

    return findUserByEmail;
  }

  public async refreshToken(userData: User): Promise<string> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail: User = await this.users.findUnique({ where: { email: userData.email } });
    if (!findUserByEmail) throw new HttpException(409, `Email ${userData.email} not found`);

    const tokenData = this.jwtHelper.signToken(findUserByEmail, 'test', 3600);

    return tokenData;
  }

  public createAccessToken(userData: User) {
    const dataStoredInToken = { id: userData.id };
    const expiresIn: number = 600;

    return { expiresIn, token: this.jwtHelper.signToken(dataStoredInToken, 'test', expiresIn) };
  }

  public createRefreshToken(userData: User) {
    const dataStoredInToken = { id: userData.id };
    const expiresIn: number = 3600;

    return { expiresIn, token: this.jwtHelper.signToken(dataStoredInToken, 'test2', expiresIn) };
  }

  public async generateToken(userData: User) {
    const accessToken = this.createAccessToken(userData);
    const refreshToken = this.createRefreshToken(userData);

    return { accessToken, refreshToken };
  }
}
