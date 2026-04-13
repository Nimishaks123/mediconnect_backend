import { ISignupUserUseCase } from "@application/interfaces/auth/ISignupUserUseCase";
import { SignupUserDTO, SignupUserResponseDTO } from "@application/dtos/auth/SignupUserDTO";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IOtpRepository } from "@domain/interfaces/IOtpRepository";
import { IPasswordHasher } from "@domain/interfaces/IPasswordHasher";
import { IOtpGenerator } from "@application/interfaces/services/IOtpGenerator";
import { IEventBus } from "@application/interfaces/IEventBus";
import { User } from "@domain/entities/User";
import { Otp, OtpContext } from "@domain/entities/Otp";
import { UserSignedUpEvent } from "@domain/events/UserSignedUpEvent";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { Doctor } from "@domain/entities/Doctor";
import { UserRole } from "@domain/enums/UserRole";

export class SignupUserUseCase implements ISignupUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly doctorRepo: IDoctorRepository,
    private readonly otpRepo: IOtpRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly otpGenerator: IOtpGenerator,
    private readonly eventBus: IEventBus,
    private readonly otpExpiryMin: number = 5
  ) {}

  async execute(input: SignupUserDTO): Promise<SignupUserResponseDTO> {
    const { name, email, phoneNumber, password, role } = input;

    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new AppError(MESSAGES.EMAIL_ALREADY_REGISTERED, StatusCode.CONFLICT);
    }

    const passwordHash = await this.passwordHasher.hash(password);

    const user = User.create({
      name,
      email,
      phoneNumber,
      passwordHash,
      role: role as any,
    });

    const createdUser = await this.userRepo.create(user);

    if (createdUser.role === UserRole.DOCTOR) {
        const doc = Doctor.startOnboarding(createdUser.id!);
        await this.doctorRepo.createDoctor(doc);
    }

    const plainOtp = this.otpGenerator.generate();
    console.log("OTP GENERATED:", plainOtp, "for:", email)
    const otpHash = await this.passwordHasher.hash(plainOtp);

    const otp = Otp.create(
      email,
      otpHash,
      new Date(Date.now() + this.otpExpiryMin * 60 * 1000),
      OtpContext.SIGNUP
    );

    await this.otpRepo.create(otp);

    await this.eventBus.publish(new UserSignedUpEvent(createdUser, plainOtp));

    return {
      success: true,
      message: MESSAGES.USER_CREATED_OTP_SENT,
      userId: createdUser.id!,
      email: createdUser.email,
    };
  }
}
