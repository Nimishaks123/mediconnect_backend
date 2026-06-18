import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IPasswordHasher } from "@domain/interfaces/IPasswordHasher";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { ChangePasswordDTO } from "@application/dtos/auth/ChangePasswordDTO";
import { IChangePasswordUseCase } from "@application/interfaces/auth/IChangePasswordUseCase";

export class ChangePasswordUseCase implements IChangePasswordUseCase{
    constructor(private readonly userRepo:IUserRepository,
        private readonly passwordHash:IPasswordHasher
    ){}
    async execute(dto:ChangePasswordDTO):Promise<void>{
        const user=await this.userRepo.findById(dto.userId);
        if(!user){
            throw new AppError("User not found",StatusCode.NOT_FOUND)
        }
        const isMatch=await this.passwordHash.compare(dto.currentPassword,user.getPasswordHash());
        if(!isMatch){
            throw new AppError("current password is incorrect",StatusCode.BAD_REQUEST);
        }
        const samePassword=await this.passwordHash.compare(dto.newPassword,user.getPasswordHash());
        if(samePassword)
        {
            throw new AppError("new password must be different from cureent password",StatusCode.BAD_REQUEST);
        }
        
        const hashedPassword=await this.passwordHash.hash(dto.newPassword);
        await this.userRepo.updatePassword(dto.userId,hashedPassword);

    }
}