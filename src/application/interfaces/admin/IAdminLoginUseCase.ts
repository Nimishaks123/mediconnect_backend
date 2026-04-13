import {LoginDTO} from "@application/dtos/auth/LoginDTO";
import { AdminLoginOutputDTO } from "../../dtos/admin/AdminLoginDTO";
export interface IAdminLoginUseCase{
    execute(input:LoginDTO):Promise<AdminLoginOutputDTO>
}
