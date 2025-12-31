import {LoginDTO} from "@application/dtos/auth/LoginDTO";
import { AdminLoginOutputDTO } from "../../dtos/admin/AdminLoginOutputDTO";
export interface IAdminLoginUseCase{
    execute(input:LoginDTO):Promise<AdminLoginOutputDTO>
}
