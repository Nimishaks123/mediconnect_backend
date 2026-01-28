import { UserRole } from "@domain/enums/UserRole";
export interface SignupUserDTO {
    name: string;
    email: string;
    phoneNumber?: string;
    password: string;
    role:UserRole;
  }
  export interface SignupUserResponseDTO {
  success: boolean;
  message: string;
  userId: string;
  email: string;
}

  