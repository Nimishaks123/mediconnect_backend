import bcrypt from "bcryptjs";
import { IPasswordHasher } from "@domain/interfaces/IPasswordHasher";
import { ICodeVerifier } from "@domain/interfaces/ICodeVerifier";

export class BcryptHasher implements IPasswordHasher, ICodeVerifier {
  private readonly saltRounds = 10;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async matches(plain: string, secure: string): Promise<boolean> {
    return this.compare(plain, secure);
  }
}
