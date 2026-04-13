import { IGetAllUsersUseCase } from "../../interfaces/admin/IGetAllUsersUseCase";
import { IUserQueryRepository } from "../../interfaces/admin/IUserQueryRepository";
import {
  GetAllUsersDTO,
  GetAllUsersResponseDTO,
} from "../../dtos/admin/GetAllUsersDTO";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private readonly userQueryRepo: IUserQueryRepository) {}

  async execute(dto: GetAllUsersDTO): Promise<GetAllUsersResponseDTO> {
    return this.userQueryRepo.findPaginated(dto);
  }
}
