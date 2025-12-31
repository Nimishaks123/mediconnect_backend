import { UserRole } from "@domain/enums/UserRole";
export interface JwtPayload {
  id: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}
