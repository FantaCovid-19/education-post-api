import jwt, { JwtPayload, Jwt } from 'jsonwebtoken';
import { JWT_SECRET } from '../configs';

export class JwtHelper {
  private secretKey: string;

  constructor() {
    this.secretKey = JWT_SECRET;
  }

  public signToken(data: any, expiresIn: number): string {
    return jwt.sign(data, this.secretKey, { expiresIn });
  }

  public verifyToken(token: string): Jwt | string | JwtPayload {
    return jwt.verify(token, this.secretKey);
  }

  public decodeToken(token: string): null | string | JwtPayload {
    return jwt.decode(token);
  }
}
