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

  async findByIds(ids: string[]): Promise<User[]> {
    const docs = await this.model.find({ _id: { $in: ids } });
    return docs.map((doc) => this.toDomain(doc));
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
  
  async findPaginated(params: {
    skip: number;
    limit: number;
    search?: string;
    role?: string;
    status?: "ACTIVE" | "BLOCKED";
  }): Promise<{ users: User[]; total: number }> {
    const { skip, limit, search, role, status } = params;

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
      users: docs.map((doc) => this.toDomain(doc)),
      total,
    };
  }

  async save(user: User): Promise<User> {
    const updated = await this.update({ _id: user.id }, this.toPersistence(user));
    if (!updated) {
      throw new AppError("Failed to save user", 500);
    }
    return updated;
  }
}
