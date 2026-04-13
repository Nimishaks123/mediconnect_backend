import { GetAllUsersDTO, GetAllUsersResponseDTO } from "../../dtos/admin/GetAllUsersDTO";

export interface IUserQueryRepository {
  findPaginated(dto: GetAllUsersDTO): Promise<GetAllUsersResponseDTO>;
}
