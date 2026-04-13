import { IUserQueryRepository } from "../../application/interfaces/admin/IUserQueryRepository";
import { GetAllUsersDTO, GetAllUsersResponseDTO } from "../../application/dtos/admin/GetAllUsersDTO";
import { UserModel } from "./models/UserModel";
import { UserMapper } from "../../application/mappers/UserMapper";
import { UserPersistenceMapper } from "./mappers/UserPersistenceMapper";

export class UserQueryRepository implements IUserQueryRepository {
  async findPaginated(dto: GetAllUsersDTO): Promise<GetAllUsersResponseDTO> {
    const { page, limit, search = "", role, status } = dto;
    const skip = (page - 1) * limit;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    if (status === "ACTIVE") {
      query.blocked = false;
    } else if (status === "BLOCKED") {
      query.blocked = true;
    }

    const [docs, total] = await Promise.all([
      UserModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      UserModel.countDocuments(query),
    ]);

    const users = docs.map((doc) => {
        const entity = UserPersistenceMapper.toDomain(doc);
        return UserMapper.toDTO(entity);
    });

    return {
      users,
      total,
      page,
      limit,
    };
  }
}
