export class ForgotPasswordOtpSentEvent {
  constructor(
    public readonly email: string,
    public readonly plainOtp: string
  ) {}
}
