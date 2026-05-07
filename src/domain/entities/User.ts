import { UserRole } from "@domain/enums/UserRole";

export class User {
  private constructor(
    private name: string,
    private email: string,
    private phoneNumber: string | undefined,
    private passwordHash: string,
    private role: UserRole,
    private isVerified: boolean = false,
    private blocked: boolean = false,
    private readonly id?: string
  ) {}
  getName(): string {
  return this.name;
}

getEmail(): string {
  return this.email;
}

getPhoneNumber(): string | undefined {
  return this.phoneNumber;
}

getPasswordHash(): string {
  return this.passwordHash;
}

getRole(): UserRole {
  return this.role;
}

isUserVerified(): boolean {
  return this.isVerified;
}

isBlocked(): boolean {
  return this.blocked;
}
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

//new user creation
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
      role === UserRole.PATIENT, 
      false // blocked
    );
  }
}
