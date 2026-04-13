import { BlockUnblockUserDTO, BlockUnblockUserResponseDTO } from "@application/dtos/admin/BlockUnblockUserDTO";

export interface IBlockUnblockUserUseCase {
  block(input: BlockUnblockUserDTO): Promise<BlockUnblockUserResponseDTO>;
  unblock(input: BlockUnblockUserDTO): Promise<BlockUnblockUserResponseDTO>;
}
