// src/application/dtos/admin/BlockUnblockUserDTO.ts
export interface BlockUnblockUserDTO {
  userId: string;
  adminId: string;
}
export interface BlockUnblockUserResponseDTO {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    blocked: boolean;
  };
}

