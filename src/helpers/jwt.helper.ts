import jwt, { JwtPayload, Jwt } from 'jsonwebtoken';
import { JWT_SECRET } from '../configs';

export class JwtHelper {
  private secretKey: string = JWT_SECRET;

  public signToken(data: any, expiresIn: number): string {
    return jwt.sign(data, this.secretKey, { expiresIn });
  }

  public verifyToken(token: string): string | JwtPayload {
    return jwt.verify(token, this.secretKey);
  }

  public decodeToken(token: string): string | JwtPayload | null {
    return jwt.decode(token);
  }
}
