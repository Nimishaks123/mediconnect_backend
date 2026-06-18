import {ChangePasswordDTO} from "@application/dtos/auth/ChangePasswordDTO"
export interface IChangePasswordUseCase{
    execute(dto:ChangePasswordDTO):Promise<void>;
}
  