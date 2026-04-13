import { LoginDTO } from "../../dtos/auth/LoginDTO";
import { LoginResponseDTO } from "../../dtos/auth/LoginDTO";

export interface ILoginUseCase {
  execute(input: LoginDTO): Promise<LoginResponseDTO>;
}
