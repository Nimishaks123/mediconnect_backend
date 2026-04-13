import { IResendOtpUseCase } from "@application/interfaces/auth/IResendOtpUseCase";
import { ResendOtpDTO, ResendOtpResponseDTO } from "@application/dtos/auth/ResendOtpDTO";
import { IOtpRepository } from "@domain/interfaces/IOtpRepository";
import { IPasswordHasher } from "@domain/interfaces/IPasswordHasher";
import { IOtpGenerator } from "@application/interfaces/services/IOtpGenerator";
import { IEventBus } from "@application/interfaces/IEventBus";
import { Otp } from "@domain/entities/Otp";
import { OtpResentEvent } from "@domain/events/OtpResentEvent";
import { MESSAGES } from "@common/constants";

export class ResendOtpUseCase implements IResendOtpUseCase {
  constructor(
    private readonly otpRepo: IOtpRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly otpGenerator: IOtpGenerator,
    private readonly eventBus: IEventBus,
    private readonly otpExpiryMin: number = 5
  ) {}

  async execute(input: ResendOtpDTO): Promise<ResendOtpResponseDTO> {
    const { email } = input;

    await this.otpRepo.deleteByEmail(email);

    const plainOtp = this.otpGenerator.generate();
    const hashedOtp = await this.passwordHasher.hash(plainOtp);

    const expiresAt = new Date(Date.now() + this.otpExpiryMin * 60 * 1000);

    const otp = Otp.create(email, hashedOtp, expiresAt);
    await this.otpRepo.create(otp);

    await this.eventBus.publish(new OtpResentEvent(email, plainOtp));

    return {
      success: true,
      message: MESSAGES.OTP_RESENT,
      email,
    };
  }
}
