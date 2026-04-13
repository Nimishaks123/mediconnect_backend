import { ResetPasswordDTO } from "../../dtos/auth/ResetPasswordDTO";
import { ResetPasswordResponseDTO } from "../../dtos/auth/ResetPasswordDTO";

export interface IResetPasswordUseCase {
  execute(input: ResetPasswordDTO): Promise<ResetPasswordResponseDTO>;
}
