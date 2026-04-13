import { IMailer } from "@domain/interfaces/IMailer";
import { ForgotPasswordOtpSentEvent } from "@domain/events/ForgotPasswordOtpSentEvent";

export class SendForgotPasswordEmailHandler {
  constructor(private readonly mailer: IMailer) {}

  async handle(event: ForgotPasswordOtpSentEvent): Promise<void> {
    const { email, plainOtp } = event;
    await this.mailer.sendOtp(email, plainOtp);
  }
}
