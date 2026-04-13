import { User } from "@domain/entities/User";

export class UserSignedUpEvent {
  constructor(
    public readonly user: User,
    public readonly plainOtp: string
  ) {}
}
