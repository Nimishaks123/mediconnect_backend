import { Admin } from "@domain/entities/Admin";
import { UserRole } from "@domain/enums/UserRole";

export class AdminMapper {
  static toTokenPayload(admin: Admin): { id: string; role: UserRole; email: string } {
    return {
      id: admin.id!,
      role: admin.role, 
      email: admin.email,
    };
  }

  static toLoginResponseDTO(admin: Admin, accessToken: string, refreshToken: string) {
    return {
      accessToken,
      refreshToken,
      admin: {
        id: admin.id!,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    };
  }
}
