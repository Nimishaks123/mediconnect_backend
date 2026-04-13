import { IResetPasswordUseCase } from "@application/interfaces/auth/IResetPasswordUseCase";
import { ResetPasswordDTO, ResetPasswordResponseDTO } from "@application/dtos/auth/ResetPasswordDTO";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IPasswordHasher } from "@domain/interfaces/IPasswordHasher";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly passwordHasher: IPasswordHasher
  ) { }

  async execute(input: ResetPasswordDTO): Promise<ResetPasswordResponseDTO> {
    const { email, newPassword } = input;

    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(MESSAGES.USER_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const newHash = await this.passwordHasher.hash(newPassword);


    user.changePassword(newHash);


    await this.userRepo.save(user);

    return {
      message: MESSAGES.PASSWORD_RESET_SUCCESS,
    };
  }
}
