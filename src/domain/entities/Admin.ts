export class Admin {
    constructor(
      public name: string,
      public email: string,
      public passwordHash: string,
      public role: "ADMIN" = "ADMIN",
      public id?: string
    ) {}
  }
  