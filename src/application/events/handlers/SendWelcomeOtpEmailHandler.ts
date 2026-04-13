import { IMailer } from "@domain/interfaces/IMailer";
import { UserSignedUpEvent } from "@domain/events/UserSignedUpEvent";

export class SendWelcomeOtpEmailHandler {
  constructor(private readonly mailer: IMailer) {}

  async handle(event: UserSignedUpEvent): Promise<void> {
    const { user, plainOtp } = event;
    await this.mailer.sendOtp(user.email, plainOtp);
  }
}
