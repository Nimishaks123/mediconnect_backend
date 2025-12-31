import { LoginWithGoogleDTO } from "@application/dtos/auth/LoginWithGoogleDTO";
import { LoginResponseDTO } from "@application/dtos/auth/LoginResponseDTO";

export interface ILoginWithGoogleUseCase {
  getGoogleAuthUrl(): string;
  execute(input: LoginWithGoogleDTO): Promise<LoginResponseDTO>;
}
