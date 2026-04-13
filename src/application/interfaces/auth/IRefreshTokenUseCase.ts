import { RefreshTokenDTO } from "../../dtos/auth/RefreshTokenDTO";
import { RefreshTokenResponseDTO } from "../../dtos/auth/RefreshTokenDTO";

export interface IRefreshTokenUseCase {
  execute(input: RefreshTokenDTO): Promise<RefreshTokenResponseDTO>;
}
