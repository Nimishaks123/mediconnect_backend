import { UserRole } from "@domain/enums/UserRole";

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  blocked: boolean;
  isVerified: boolean;
}
