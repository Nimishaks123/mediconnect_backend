import { IAdminRepository } from "../../../domain/interfaces/IAdminRepository";
import { ITokenService } from "../../interfaces/services/ITokenService";
import { IPasswordHasher } from "@domain/interfaces/IPasswordHasher";
import { AppError } from "../../../common/AppError";
import { LoginDTO } from "@application/dtos/auth/LoginDTO";
import { AdminLoginOutputDTO } from "@application/dtos/admin/AdminLoginDTO";
import { IAdminLoginUseCase } from "@application/interfaces/admin/IAdminLoginUseCase";
import { StatusCode } from "../../../common/enums";
import { AdminMapper } from "../../mappers/AdminMapper";

export class AdminLoginUseCase implements IAdminLoginUseCase {
  constructor(
    private readonly adminRepo: IAdminRepository,
    private readonly tokenService: ITokenService,
    private readonly passwordHasher: IPasswordHasher
  ) {}

  async execute(input: LoginDTO): Promise<AdminLoginOutputDTO> {
    const { email, password } = input;
    const admin = await this.adminRepo.findByEmail(email);

    if (!admin) {
      throw new AppError("Invalid credentials", StatusCode.BAD_REQUEST);
    }

    const isValid = await this.passwordHasher.compare(password, admin.passwordHash);
    if (!isValid) {
      throw new AppError("Invalid credentials", StatusCode.BAD_REQUEST);
    }

    const payload = AdminMapper.toTokenPayload(admin);
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return AdminMapper.toLoginResponseDTO(admin, accessToken, refreshToken);
  }
}

