import { IAdminRepository } from "@domain/interfaces/IAdminRepository";
import { Admin } from "@domain/entities/Admin";
import { AdminModel } from "./models/AdminModel";
import { UserModel } from "./models/UserModel";
import { AdminPersistenceMapper } from "./mappers/AdminPersistenceMapper";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    const doc = await AdminModel.findOne({ email }).lean();
    if (!doc) return null;
    return AdminPersistenceMapper.toDomain(doc);
  }

  async findAdminId(): Promise<string | null> {
    const doc = await AdminModel.findOne({}, "_id").lean();
    if (doc) return doc._id.toString();

    const userDoc = await UserModel.findOne({ role: "ADMIN" }, "_id").lean();
    return userDoc ? userDoc._id.toString() : null;
  }
}
