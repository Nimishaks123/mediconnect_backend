import {
  GetAllUsersDTO,
  GetAllUsersResponseDTO,
} from "../../dtos/admin/GetAllUsersDTO";

export interface IGetAllUsersUseCase {
  execute(dto: GetAllUsersDTO): Promise<GetAllUsersResponseDTO>;
}
