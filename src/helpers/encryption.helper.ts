import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../configs';

class EncryptHelper {
  private readonly salt: number = SALT_ROUNDS;

  public hashPassword(password: string): string {
    return bcrypt.hashSync(password, Number(this.salt));
  }

  public comparePassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}

export { EncryptHelper };
