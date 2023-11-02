import { db } from '../utils/db.util';
import { isEmpty } from '../utils/isEmpty.util';
import { HttpException } from '../helpers/httpException.helper';
import { EncryptHelper } from '../helpers/encrypt.helper';
import { JwtHelper } from '../helpers/jwt.helper';

export default class AuthService {
  private users = db.user;
  private jwtHelper: JwtHelper;
  private encryptHelper: EncryptHelper;

  constructor() {
    this.jwtHelper = new JwtHelper();
    this.encryptHelper = new EncryptHelper();
  }

  public async signUp(userData: any) {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail = await this.users.findUnique({ where: { email: userData.email } });
    if (findUserByEmail) throw new HttpException(409, `Email ${userData.email} already exists`);

    const hashedPassword = await this.encryptHelper.hashPassword(userData.password);
    const createUser = await this.users.create({ data: { ...userData, password: hashedPassword } });

    return createUser;
  }

  public async signIn(userData: any): Promise<object> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail = await this.users.findUnique({ where: { email: userData.email } });
    if (!findUserByEmail) throw new HttpException(409, `Email ${userData.email} not found`);

    const isPasswordMatching: boolean = await this.encryptHelper.comparePassword(userData.password, findUserByEmail.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is incorrect');

    const { accessToken, refreshToken } = await this.generateToken(findUserByEmail);

    return { findUserByEmail, accessToken, refreshToken };
  }

  public async signOut(userData: any): Promise<any> {
    if (isEmpty(userData)) throw new HttpException(400, 'User data is required');

    const findUserByEmail = await this.users.findFirst({ where: { id: userData.id } });
    if (!findUserByEmail) throw new HttpException(409, `User not found`);

    return findUserByEmail;
  }

  public createAccessToken(userData: any) {
    const dataStoredInToken = { id: userData.id };
    const expiresIn: number = 600;

    return { expiresIn, token: this.jwtHelper.signToken(dataStoredInToken, expiresIn) };
  }

  public createRefreshToken(userData: any) {
    const dataStoredInToken = { id: userData.id };
    const expiresIn: number = 3600;

    return { expiresIn, token: this.jwtHelper.signToken(dataStoredInToken, expiresIn) };
  }

  public async generateToken(userData: any) {
    const accessToken = this.createAccessToken(userData);
    const refreshToken = this.createRefreshToken(userData);

    return { accessToken, refreshToken };
  }

  public async getUserByTokenId(userId: number | string): Promise<any> {
    const findUserById: any = await this.users.findUnique({ where: { id: Number(userId) } });
    findUserById.password = undefined;

    return findUserById;
  }

  public getPublicUserData(userData: any) {
    const publicData = {
      email: userData.email,
      role: userData.role
    };

    return publicData;
  }
}
