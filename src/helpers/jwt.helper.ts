import jwt, { JwtPayload } from 'jsonwebtoken';

export class JwtHelper {
  public signToken(data: any, secret: string, expiresIn: number): string {
    return jwt.sign(data, secret, { expiresIn });
  }

  public verifyToken(token: string, secret: string): string | JwtPayload {
    return jwt.verify(token, secret);
  }

  public decodeToken(token: string): string | JwtPayload {
    return jwt.decode(token);
  }
}
