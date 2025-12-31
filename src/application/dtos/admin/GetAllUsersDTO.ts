// import { UserDTO } from "./UserDTO";
// export interface GetAllUsersDTO {
//   page: number;
//   limit: number;
//   search: string;
// }

// export interface GetAllUsersResponseDTO {
//   users: UserDTO[];
//   total: number;
//   page: number;
//   limit: number;
// }
// import { UserDTO } from "./UserDTO";

// export interface GetAllUsersDTO {
//   page: number;
//   limit: number;
//   search?: string;   // optional (cleaner)
//   role?: string;     // ADMIN | DOCTOR | PATIENT
//   status?: string;   // ACTIVE | BLOCKED
// }

// export interface GetAllUsersResponseDTO {
//   users: UserDTO[];
//   total: number;
//   page: number;
//   limit: number;
// }
export type UserStatus = "ACTIVE" | "BLOCKED";
 import { UserDTO } from "./UserDTO";

export interface GetAllUsersDTO {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  status?: UserStatus;
}
export interface GetAllUsersResponseDTO {
  users: UserDTO[];
  total: number;
  page: number;
  limit: number;
}

