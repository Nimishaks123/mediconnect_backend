export class OtpResentEvent {
  constructor(
    public readonly email: string, 
    public readonly plainOtp: string
  ) {}
}
