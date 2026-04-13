import { IMailer } from "@domain/interfaces/IMailer";
import { OtpResentEvent } from "@domain/events/OtpResentEvent";

export class SendOtpEmailHandler {
  constructor(private readonly mailer: IMailer) {}

  async handle(event: OtpResentEvent): Promise<void> {
    const { email, plainOtp } = event;
    await this.mailer.sendOtp(email, plainOtp);
  }
}
