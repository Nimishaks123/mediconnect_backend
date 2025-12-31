
export class Otp {
  constructor(
    public email: string,
    public code: string,
    public expiresAt: Date,
    public createdAt: Date = new Date(),
    public attempts: number = 0,
    public id?: string,
    public context: "SIGNUP" | "FORGOT_PASSWORD" = "SIGNUP",  
    public verified: boolean = false                           
  ) {}

  isExpired(): boolean {
    return this.expiresAt < new Date();
  }
}
