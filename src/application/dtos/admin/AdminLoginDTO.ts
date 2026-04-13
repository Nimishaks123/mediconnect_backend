import { UserRole } from "../../../domain/enums/UserRole";

export type AdminLoginDTO = {
  email: string;
  password: string;
};

export type AdminLoginOutputDTO = {
  accessToken: string;
  refreshToken: string;
  admin: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
};