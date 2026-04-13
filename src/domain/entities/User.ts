import { UserRole } from "@domain/enums/UserRole";

export class User {
  private constructor(
    public name: string,
    public email: string,
    public phoneNumber: string | undefined,
    public passwordHash: string,
    public role: UserRole,
    public isVerified: boolean = false,
    public blocked: boolean = false,
    public readonly id?: string
  ) {}

  /**
   * ✅ DDD Factory Method for reconstruction
   * Ensures domain invariants are maintained when rehydrating from persistence.
   */
  static rehydrate(data: {
    name: string;
    email: string;
    phoneNumber?: string;
    passwordHash: string;
    role: UserRole;
    isVerified: boolean;
    blocked: boolean;
    id: string;
  }): User {
    return new User(
      data.name,
      data.email,
      data.phoneNumber,
      data.passwordHash,
      data.role,
      data.isVerified,
      data.blocked,
      data.id
    );
  }

  /**
   * ✅ Domain Factory for new User creation
   */
  static create(data: {
    name: string;
    email: string;
    phoneNumber?: string;
    passwordHash: string;
    role: UserRole;
  }): User {
    return new User(
      data.name,
      data.email,
      data.phoneNumber,
      data.passwordHash,
      data.role,
      false, // isVerified
      false  // blocked
    );
  }

  getId(): string {
    return this.id || "";
  }

  verify() {
    this.isVerified = true;
  }

  block() {
    this.blocked = true;
  }

  unblock() {
    this.blocked = false;
  }

  changePassword(newHash: string) {
    this.passwordHash = newHash;
  }

  isDoctor(): boolean {
    return this.role === UserRole.DOCTOR;
  }

  isPatient(): boolean {
    return this.role === UserRole.PATIENT;
  }

  static createOAuthUser(name: string, email: string, passwordHash: string, role: UserRole = UserRole.PATIENT): User {
    return new User(
      name || email.split("@")[0],
      email,
      undefined,
      passwordHash,
      role,
      role === UserRole.PATIENT, // patients are verified immediately, doctors must wait for approval
      false // blocked
    );
  }
}
