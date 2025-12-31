import { SignupUserDTO } from "../../dtos/auth/SignupUserDTO";
import { SignupUserResponseDTO } from "../../dtos/auth/SignupUserResponseDTO";

export interface ISignupUserUseCase {
  execute(input: SignupUserDTO): Promise<SignupUserResponseDTO>;
}
