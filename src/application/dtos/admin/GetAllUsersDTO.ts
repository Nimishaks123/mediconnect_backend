export type UserStatus = "ACTIVE" | "BLOCKED";
 import { UserDTO } from "./UserDTO";

export type GetAllUsersDTO = {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: UserStatus;
}
export type GetAllUsersResponseDTO ={
  users: UserDTO[];
  total: number;
  page: number;
  limit: number;
}

