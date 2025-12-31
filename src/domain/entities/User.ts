import { UserRole } from "@domain/enums/UserRole";
export class User {
  constructor(
    public name: string,
    public email: string,
    public phoneNumber: string | undefined,
    public passwordHash: string,

    public role:UserRole,

    public isVerified: boolean = false,
    public blocked: boolean = false,

    public id?: string
  ) {}

  verify() {
    this.isVerified = true;
  }

  block() {
    this.blocked = true;
  }

  unblock() {
    this.blocked = false;
  }
}
