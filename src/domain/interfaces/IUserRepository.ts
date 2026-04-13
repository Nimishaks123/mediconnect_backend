import { User } from "../../domain/entities/User";

export interface IUserRepository {
  create(user: User): Promise<User>;

  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByIds(ids: string[]): Promise<User[]>;

  findAll(): Promise<User[]>;

  updateById(
    id: string,
    update: Partial<User>
  ): Promise<User>;

  // ✅ UPDATED: supports filters
  findPaginated(params: {
    skip: number;
    limit: number;
    search?: string;
    role?: string;
    status?: "ACTIVE" | "BLOCKED";
  }): Promise<{
    users: User[];
    total: number;
  }>;

  save(user: User): Promise<User>;
}
