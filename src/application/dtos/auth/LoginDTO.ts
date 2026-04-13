export type LoginDTO= {
    email: string;
    password: string;
  }
  import { UserRole } from "@domain/enums/UserRole";
  
  export type LoginResponseDTO = {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      onboardingStatus?: string;
    };
  }
  
  