export type BlockUnblockUserDTO = {
  userId: string;
  adminId: string;
}
export type BlockUnblockUserResponseDTO ={
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    blocked: boolean;
  };
}

