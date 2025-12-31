export interface LoginDTO {
    email: string;
    password: string;
  }
  import { UserRole } from "@domain/enums/UserRole";
  
  export interface LoginResponseDTO {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role:UserRole;
    };
  }
  
  