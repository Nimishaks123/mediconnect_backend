import { IAdminRepository } from "@domain/interfaces/IAdminRepository";
import { Admin } from "@domain/entities/Admin";
import { AdminModel} from "./models/AdminModel";
import { AdminPersistenceMapper } from "./mappers/AdminPersistenceMapper";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    const doc = await AdminModel.findOne({ email }).lean();//plain js,faster
    
    if (!doc) return null;

    return AdminPersistenceMapper.toDomain(doc);
  }
}
