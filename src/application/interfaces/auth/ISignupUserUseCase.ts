import { SignupUserDTO } from "../../dtos/auth/SignupUserDTO";
import { SignupUserResponseDTO } from "../../dtos/auth/SignupUserDTO";

export interface ISignupUserUseCase {
  execute(input: SignupUserDTO): Promise<SignupUserResponseDTO>;
}
