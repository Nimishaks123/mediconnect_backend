import { ResetPasswordDTO } from "../../dtos/auth/ResetPasswordDTO";
import { ResetPasswordResponseDTO } from "../../dtos/auth/ResetPasswordResponseDTO";

export interface IResetPasswordUseCase {
  execute(input: ResetPasswordDTO): Promise<ResetPasswordResponseDTO>;
}
