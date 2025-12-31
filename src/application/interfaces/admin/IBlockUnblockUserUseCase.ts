import { BlockUnblockUserDTO } from "@application/dtos/admin/BlockUnblockUserDTO";
import { BlockUnblockUserResponseDTO } from "@application/dtos/admin/BlockUnblockUserResponseDTO";

export interface IBlockUnblockUserUseCase {
  block(input: BlockUnblockUserDTO): Promise<BlockUnblockUserResponseDTO>;
  unblock(input: BlockUnblockUserDTO): Promise<BlockUnblockUserResponseDTO>;
}
