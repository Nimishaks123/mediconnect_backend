import { LoginWithGoogleDTO } from "@application/dtos/auth/LoginWithGoogleDTO";
import { LoginResponseDTO } from "@application/dtos/auth/LoginDTO";

export interface ILoginWithGoogleUseCase {
  getGoogleAuthUrl(role?: string): string;
  execute(input: LoginWithGoogleDTO): Promise<LoginResponseDTO>;
}
