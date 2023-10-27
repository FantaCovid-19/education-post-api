import bcrypt from 'bcrypt';

export class EncryptHelper {
  public async hashPassword(password: string, salt: number): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
