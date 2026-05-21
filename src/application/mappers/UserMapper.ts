import { User } from "@domain/entities/User";
import { UserDTO } from "../dtos/admin/UserDTO";

export class UserMapper {
  static toDTO(user: User): UserDTO {
    return {
      id: user.getId()!,
      name: user.getName(),
      email: user.getEmail(),
      role: user.getRole(),
      blocked: user.isBlocked(),
      isVerified: user.isUserVerified(),
    };
  }

  static toBlockResponse(user: User, message: string) {
    return {
      message,
      user: {
        id: user.getId() ?? "",
        name: user.getName(),
        email: user.getEmail(),
        blocked: user.isBlocked(),
      },
    };
  }
}
