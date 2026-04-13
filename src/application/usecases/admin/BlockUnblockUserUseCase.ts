import { IBlockUnblockUserUseCase } from "@application/interfaces/admin/IBlockUnblockUserUseCase";
import { BlockUnblockUserDTO, BlockUnblockUserResponseDTO } from "@application/dtos/admin/BlockUnblockUserDTO";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { AppError } from "@common/AppError";
import { UserMapper } from "../../mappers/UserMapper";
import { StatusCode } from "@common/enums";


export class BlockUnblockUserUseCase implements IBlockUnblockUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async block(dto: BlockUnblockUserDTO): Promise<BlockUnblockUserResponseDTO> {
    return this.updateBlockedStatus(dto.userId, true, "User blocked");
  }

  async unblock(dto: BlockUnblockUserDTO): Promise<BlockUnblockUserResponseDTO> {
    return this.updateBlockedStatus(dto.userId, false, "User unblocked");
  }

  private async updateBlockedStatus(
    userId: string,
    blocked: boolean,
    successMessage: string
  ): Promise<BlockUnblockUserResponseDTO> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError("User not found",StatusCode.NOT_FOUND);
    }

    if (blocked) {
      user.block();
    } else {
      user.unblock();
    }

    const savedUser = await this.userRepo.save(user);

    return UserMapper.toBlockResponse(savedUser, successMessage);
  }
}
