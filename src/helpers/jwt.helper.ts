import jwt, { JwtPayload } from 'jsonwebtoken';
import { configs, IAppConfig } from '@config';

export class JwtHelper {
  private config: IAppConfig;

  constructor() {
    this.config = configs;
  }

  public signToken(data: any, expiresIn: number): string {
    return jwt.sign(data, this.config.JWT_SECRET, { expiresIn });
  }

  public verifyToken(token: string): string | JwtPayload {
    return jwt.verify(token, this.config.JWT_SECRET);
  }

  public decodeToken(token: string): string | JwtPayload {
    return jwt.decode(token);
  }
}
