import bcrypt from 'bcrypt';
import { configs, IAppConfig } from '@config';

export class EncryptHelper {
  private readonly salt: number | string;

  constructor() {
    const config: IAppConfig = configs;
    this.salt = config.SALT_ROUNDS;
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, Number(this.salt));
  }

  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
