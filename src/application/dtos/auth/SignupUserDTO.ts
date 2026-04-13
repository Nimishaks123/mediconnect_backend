import { UserRole } from "@domain/enums/UserRole";
export type SignupUserDTO ={
    name: string;
    email: string;
    phoneNumber?: string;
    password: string;
    role:UserRole;
  }
  export type SignupUserResponseDTO ={
  success: boolean;
  message: string;
  userId: string;
  email: string;
}

  