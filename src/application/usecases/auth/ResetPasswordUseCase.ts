import { IResetPasswordUseCase } from "../../interfaces/auth/IResetPasswordUseCase";
import { ResetPasswordDTO } from "../../dtos/auth/ResetPasswordDTO";
import { ResetPasswordResponseDTO } from "../../dtos/auth/ResetPasswordResponseDTO";

import { IUserRepository } from "../../../domain/interfaces/IUserRepository";

import { AppError } from "../../../common/AppError";
import { MESSAGES } from "../../../common/constants";
import { StatusCode } from "../../../common/enums";

import bcrypt from "bcryptjs";

export class ResetPasswordUseCase implements IResetPasswordUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(
    input: ResetPasswordDTO
  ): Promise<ResetPasswordResponseDTO> {
    const { email, newPassword } = input;

    //  Validate input
    if (!email || !newPassword) {
      throw new AppError(
  MESSAGES.PASSWORD_RESET_INPUT_INVALID,
  StatusCode.BAD_REQUEST
);

    }

    // Find user
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError(
        MESSAGES.USER_NOT_FOUND,
        StatusCode.NOT_FOUND
      );
    }

    //  Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.userRepo.updateById(user.id!, {
      passwordHash: newHash,
    });

    // Return response
    return {
      message: MESSAGES.PASSWORD_RESET_SUCCESS, 
    };
  }
}
