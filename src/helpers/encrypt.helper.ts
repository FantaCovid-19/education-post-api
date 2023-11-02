import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../configs';

export class EncryptHelper {
  private readonly salt: number | string;

  constructor() {
    this.salt = SALT_ROUNDS;
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Number(this.salt));
  }

  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
