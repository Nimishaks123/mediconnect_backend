export interface VerifyOtpDTO {
    email: string;
    code: string;
  }
  import { UserRole } from "@domain/enums/UserRole";
  
  export interface VerifyOtpResponseDTO {
    success: boolean;
    message: string;
    user: {
      id: string;
      name: string;
      email: string;
      role:UserRole;
    };
  }
  