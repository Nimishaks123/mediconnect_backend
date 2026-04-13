import { UserRole } from "@domain/enums/UserRole";
export interface JwtPayload {
  id: string;
  role: UserRole;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}
