import { User } from "@domain/entities/User";
import { UserDTO } from "../dtos/admin/UserDTO";

export class UserMapper {
  static toDTO(user: User): UserDTO {
    return {
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role,
      blocked: user.blocked,
      isVerified: user.isVerified,
    };
  }
}
