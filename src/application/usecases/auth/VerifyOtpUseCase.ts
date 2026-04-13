import { IVerifyOtpUseCase } from "@application/interfaces/auth/IVerifyOtpUseCase";
import { VerifyOtpDTO, VerifyOtpResponseDTO } from "@application/dtos/auth/VerifyOtpDTO";
import { IOtpRepository } from "@domain/interfaces/IOtpRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { ICodeVerifier } from "@domain/interfaces/ICodeVerifier";
import { OtpCode } from "@domain/value-objects/OtpCode";
import { OtpContext } from "@domain/entities/Otp";
import { AuthMapper } from "@application/mappers/AuthMapper";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { UserRole } from "@domain/enums/UserRole";

export class VerifyOtpUseCase implements IVerifyOtpUseCase {
  constructor(
    private readonly otpRepo: IOtpRepository,
    private readonly userRepo: IUserRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly codeVerifier: ICodeVerifier
  ) {}

  async execute(input: VerifyOtpDTO): Promise<VerifyOtpResponseDTO> {
    const { email, code: rawCode } = input;

    const providedCode = new OtpCode(rawCode);

    const otp = await this.otpRepo.findLatestByEmail(email, OtpContext.SIGNUP);

    if (!otp) {
      throw new AppError(MESSAGES.OTP_INVALID, StatusCode.NOT_FOUND);
    }

 
    await otp.verify(providedCode, this.codeVerifier);
    
    otp.consume();
    
    await this.otpRepo.save(otp);

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    user.verify();
    await this.userRepo.save(user);

    await this.otpRepo.deleteByEmail(email);
    
    let onboardingStatus;
    if (user.role === UserRole.DOCTOR) {
        const doc = await this.doctorRepo.findByUserId(user.id!);
        onboardingStatus = doc?.onboardingStatus;
    }

    return AuthMapper.toVerifyOtpResponse(user, onboardingStatus);
  }
}
