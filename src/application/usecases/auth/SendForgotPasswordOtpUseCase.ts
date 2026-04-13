import { ISendForgotPasswordOtpUseCase } from "@application/interfaces/auth/ISendForgotPasswordOtpUseCase";
import { SendForgotPasswordOtpDTO, SendForgotPasswordOtpResponseDTO } from "@application/dtos/auth/SendForgotPasswordOtpDTO";
import { IOtpRepository } from "@domain/interfaces/IOtpRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IPasswordHasher } from "@domain/interfaces/IPasswordHasher";
import { IOtpGenerator } from "@application/interfaces/services/IOtpGenerator";
import { IEventBus } from "@application/interfaces/IEventBus";
import { Otp, OtpContext } from "@domain/entities/Otp";
import { ForgotPasswordOtpSentEvent } from "@domain/events/ForgotPasswordOtpSentEvent";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";

export class SendForgotPasswordOtpUseCase implements ISendForgotPasswordOtpUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly otpRepo: IOtpRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly otpGenerator: IOtpGenerator,
    private readonly eventBus: IEventBus,
    private readonly expiryMin: number = 5
  ) {}

  async execute(input: SendForgotPasswordOtpDTO): Promise<SendForgotPasswordOtpResponseDTO> {
    const { email } = input;

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    await this.otpRepo.deleteByEmail(email);

    const plainOtp = this.otpGenerator.generate();
    const hashOtp = await this.passwordHasher.hash(plainOtp);

    const otp = Otp.create(
      email,
      hashOtp,
      new Date(Date.now() + this.expiryMin * 60 * 1000),
      OtpContext.FORGOT_PASSWORD
    );

    await this.otpRepo.create(otp);

    await this.eventBus.publish(new ForgotPasswordOtpSentEvent(email, plainOtp));

    return {
      message: MESSAGES.OTP_SENT_FOR_PASSWORD_RESET ?? "OTP sent to email",
    };
  }
}
