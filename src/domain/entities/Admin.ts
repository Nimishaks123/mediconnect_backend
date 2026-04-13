import { UserRole } from "../enums/UserRole";

export class Admin {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole = UserRole.ADMIN,
    public readonly id?: string
  ) {}

  /**
   * ✅ DDD Factory Method for reconstruction
   * Ensures domain invariants are maintained when rehydrating from persistence.
   */
  static rehydrate(
    name: string,
    email: string,
    passwordHash: string,
    role: UserRole,
    id: string
  ): Admin {
    // Here we can perform domain validation if necessary
    return new Admin(name, email, passwordHash, role, id);
  }

  /**
   * Factory method for creating new Admin (if needed in use cases)
   */
  static create(name: string, email: string, passwordHash: string): Admin {
    return new Admin(name, email, passwordHash, UserRole.ADMIN);
  }
}