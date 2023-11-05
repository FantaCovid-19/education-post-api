import { prisma } from '../utils/prisma.util';
import { HttpException } from '../helpers/httpException.helper';
import { EncryptHelper } from '../helpers/encryption.helper';
import { JwtHelper } from '../helpers/jwt.helper';
import { NODE_ENV } from '../configs';

import {
  SignUpInput,
  SignUpResponse,
  SignInInput,
  SignInResponse,
  SignOutInput,
  SignOutResponse,
  AccessTokenInput,
  AccessTokenPayload,
  RefreshTokenInput,
  RefreshTokenPayload,
  GenerateTokenInput,
  GenerateTokenPayload,
  PublicaDataInput,
  PublicaDataPayload
} from '../interfaces/auth.interface';

export default class AuthService {
  private jwtHelper: JwtHelper = new JwtHelper();
  private encryptHelper: EncryptHelper = new EncryptHelper();

  public async signUp(userData: SignUpInput): Promise<SignUpResponse> {
    if (!userData) throw new HttpException(400, 'User data is required');

    const findUserByEmail = await prisma.user.findUnique({ where: { email: userData.email }, select: { email: true } });
    if (findUserByEmail) throw new HttpException(409, `Email ${userData.email} already exists`);

    const hashedPassword = this.encryptHelper.hashPassword(userData.password);
    const createUser = await prisma.user.create({ data: { ...userData, password: hashedPassword }, select: { email: true, role: true } });

    return createUser;
  }

  public async signIn(userData: SignInInput): Promise<SignInResponse> {
    if (!userData) throw new HttpException(400, 'User data is required');

    const findUserByEmail = await prisma.user.findUnique({ where: { email: userData.email }, select: { id: true, email: true, password: true, role: true } });
    if (!findUserByEmail) throw new HttpException(409, `Email ${userData.email} not found`);

    const isPasswordMatching: boolean = this.encryptHelper.comparePassword(userData.password, findUserByEmail.password);
    if (!isPasswordMatching) throw new HttpException(409, 'Password is incorrect');

    const { accessToken, refreshToken, cookie } = await this.generateToken(findUserByEmail);

    return { signInData: findUserByEmail, accessToken, refreshToken, cookie };
  }

  public async signOut(userData: any): Promise<SignOutResponse> {
    if (!userData) throw new HttpException(400, 'User data is required');

    const findUserById = await prisma.user.findUnique({ where: { id: userData.id, email: userData.email }, select: { email: true, role: true } });
    if (!findUserById) throw new HttpException(409, `User not found`);

    return findUserById;
  }

  public createAccessToken(userData: AccessTokenInput): AccessTokenPayload {
    const dataStoredInToken = { id: userData.id };
    const expiresIn: number = 600;

    return { expiresIn, token: this.jwtHelper.signToken(dataStoredInToken, expiresIn) };
  }

  public createRefreshToken(userData: RefreshTokenInput): RefreshTokenPayload {
    const dataStoredInToken = { id: userData.id };
    const expiresIn: number = 3600;

    return { expiresIn, token: this.jwtHelper.signToken(dataStoredInToken, expiresIn) };
  }

  public createRefreshCookie(refreshToken: string, expiresIn: number): string {
    const secure = NODE_ENV === 'production' ? 'secure' : '';
    const cookie = `refreshToken=${refreshToken}; HttpOnly; Max-Age=${expiresIn}; Path=/; Max-Age=${3600}; SameSite=Lax; ${secure}`;

    return cookie;
  }

  public getUserByTokenId(tokenId: string): Promise<any> {
    if (!tokenId) throw new HttpException(400, 'Token ID is required');

    const findUserById = prisma.user.findUnique({ where: { id: tokenId }, select: { id: true, email: true, role: true, refreshToken: true } });
    if (!findUserById) throw new HttpException(409, 'User not found');

    return findUserById;
  }

  public async updateUserRefreshToken(userId: string, refreshToken: string | null): Promise<object> {
    if (!userId) throw new HttpException(400, 'User ID is required');

    const updateUser = await prisma.user.update({ where: { id: userId }, data: { refreshToken } });
    if (!updateUser) throw new HttpException(409, 'User not found');

    return updateUser;
  }

  public async generateToken(userData: GenerateTokenInput): Promise<GenerateTokenPayload> {
    const accessToken = this.createAccessToken(userData);
    const refreshToken = this.createRefreshToken(userData);
    const cookie = this.createRefreshCookie(refreshToken.token, refreshToken.expiresIn);

    return { accessToken, refreshToken, cookie };
  }

  public getPublicUserData(userData: PublicaDataInput): PublicaDataPayload {
    const publicData = {
      email: userData.email,
      role: userData.role
    };

    return publicData;
  }
}
