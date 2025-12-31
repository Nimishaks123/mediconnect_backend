// src/application/usecases/admin/BlockUnblockUserUseCase.ts
import { IBlockUnblockUserUseCase } from "@application/interfaces/admin/IBlockUnblockUserUseCase";
import { BlockUnblockUserDTO } from "@application/dtos/admin/BlockUnblockUserDTO";
import { BlockUnblockUserResponseDTO } from "@application/dtos/admin/BlockUnblockUserResponseDTO";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { AppError } from "@common/AppError";

export class BlockUnblockUserUseCase implements IBlockUnblockUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async block(dto: BlockUnblockUserDTO): Promise<BlockUnblockUserResponseDTO> {
    const { userId, adminId } = dto;
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    user.block();
    const updated = await this.userRepo.updateById(userId, { blocked: true });

    return {
      message: "User blocked",
      user: {
        id: updated.id ?? "",
        name: updated.name,
        email: updated.email,
        blocked: updated.blocked,
      },
    };
  }

  async unblock(dto: BlockUnblockUserDTO): Promise<BlockUnblockUserResponseDTO> {
    const { userId, adminId } = dto;
    const user = await this.userRepo.findById(userId);
    if (!user) throw new AppError("User not found", 404);

    user.unblock();
    const updated = await this.userRepo.updateById(userId, { blocked: false });

    return {
      message: "User unblocked",
      user: {
        id: updated.id ?? "",
        name: updated.name,
        email: updated.email,
        blocked: updated.blocked,
      },
    };
  }
}
