import { UserRole } from "@domain/enums/UserRole";

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  blocked: boolean;
  isVerified: boolean;
}
