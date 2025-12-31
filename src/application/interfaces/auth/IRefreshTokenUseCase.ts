import { RefreshTokenDTO } from "../../dtos/auth/RefreshTokenDTO";
import { RefreshTokenResponseDTO } from "../../dtos/auth/RefreshTokenResponseDTO";

export interface IRefreshTokenUseCase {
  execute(input: RefreshTokenDTO): Promise<RefreshTokenResponseDTO>;
}
