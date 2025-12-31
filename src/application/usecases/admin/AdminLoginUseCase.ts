import { IAdminRepository } from "../../../domain/interfaces/IAdminRepository";
import { TokenService } from "../../services/TokenService";
import { AppError } from "../../../common/AppError";
import { LoginDTO } from "@application/dtos/auth/LoginDTO";
import { AdminLoginOutputDTO } from "@application/dtos/admin/AdminLoginOutputDTO";
import { IAdminLoginUseCase } from "@application/interfaces/admin/IAdminLoginUseCase";
import {StatusCode} from "../../../common/enums"
import bcrypt from "bcryptjs";

export class AdminLoginUseCase implements IAdminLoginUseCase {
  constructor(
    private readonly adminRepo: IAdminRepository,
    private readonly tokenService: TokenService
  ) {}

  async execute(input:LoginDTO) :Promise<AdminLoginOutputDTO>{
    const{email,password}=input;
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) throw new AppError("Invalid credentials", StatusCode.BAD_REQUEST);

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) throw new AppError("Invalid credentials", StatusCode.BAD_REQUEST);

const payload = {
  id: admin.id!,
  role: "ADMIN" as const,
  email: admin.email
};


    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      admin: {
        id: admin.id!,
        name: admin.name,
        email: admin.email,
        role: "ADMIN" as const
      }
    };
  }
}
