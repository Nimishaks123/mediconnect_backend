import { IGetAllUsersUseCase } from "../../interfaces/admin/IGetAllUsersUseCase";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import {
  GetAllUsersDTO,
  GetAllUsersResponseDTO,
} from "../../dtos/admin/GetAllUsersDTO";
import { UserMapper } from "@application/mappers/UserMapper";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(dto: GetAllUsersDTO): Promise<GetAllUsersResponseDTO> {
    const {
      page,
      limit,
      search = "",
      role,
      status,
    } = dto;

    const skip = (page - 1) * limit;

    const { users, total } = await this.userRepo.findPaginated({
      skip,
      limit,
      search,
      role,
      status,
    });

    return {
      users: users.map(UserMapper.toDTO),
      total,
      page,
      limit,
    };
  }
}
