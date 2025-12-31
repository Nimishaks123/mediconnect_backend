import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel, UserDB } from "./models/UserModel";
import { BaseRepository } from "./BaseRepository";
import { UserPersistenceMapper } from "./mappers/UserPersistenceMapper";
import { AppError } from "../../common/AppError";

export class UserRepository
  extends BaseRepository<User, UserDB>
  implements IUserRepository {

  constructor() {
    super(UserModel);
  }

  protected toDomain(doc: UserDB): User {
    return UserPersistenceMapper.toDomain(doc);
  }

  protected toPersistence(entity: User): Partial<UserDB> {
    return UserPersistenceMapper.toPersistence(entity);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async findById(id: string): Promise<User | null> {
    return this.findOne({ _id: id });
  }

  async findAll(): Promise<User[]> {
    return this.findMany();
  }

  async updateById(
    id: string,
    update: Partial<User>
  ): Promise<User> {
    const updated = await this.update({ _id: id }, update);
    if (!updated) {
      throw new AppError("Failed to update user", 500);
    }
    return updated;
  }
  // async findPaginated(params: {
  //   skip: number;
  //   limit: number;
  //   search: string;
  // }): Promise<{ users: User[]; total: number }> {
  //   const { skip, limit, search } = params;

  //   const query = search
  //     ? {
  //         $or: [
  //           { name: { $regex: search, $options: "i" } },
  //           { email: { $regex: search, $options: "i" } },
  //         ],
  //       }
  //     : {};

  //   const [docs, total] = await Promise.all([
  //     this.model
  //       .find(query)
  //       .skip(skip)
  //       .limit(limit)
  //       .sort({ createdAt: -1 }),
  //     this.model.countDocuments(query),
  //   ]);

  //   return {
  //     users: docs.map(this.toDomain),
  //     total,
  //   };
  // }
  async findPaginated(params: {
  skip: number;
  limit: number;
  search?: string;
  role?: string;
  status?: "ACTIVE" | "BLOCKED";
}): Promise<{ users: User[]; total: number }> {
  const { skip, limit, search, role, status } = params;

  // ✅ Build query dynamically
  const query: any = {};

  // 🔍 Search by name or email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  // 🧑 Role filter
  if (role) {
    query.role = role;
  }

  // 🚦 Status filter
  if (status === "ACTIVE") {
    query.blocked = false;
  }

  if (status === "BLOCKED") {
    query.blocked = true;
  }

  const [docs, total] = await Promise.all([
    this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    this.model.countDocuments(query),
  ]);

  return {
    users: docs.map(this.toDomain),
    total,
  };
}

}
