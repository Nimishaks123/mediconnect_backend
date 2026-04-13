import { IAdminRepository } from "../../domain/interfaces/IAdminRepository";
import { Admin } from "../../domain/entities/Admin";
import { AdminModel, AdminDB } from "./models/AdminModel";
import { AdminPersistenceMapper } from "./mappers/AdminPersistenceMapper";

export class AdminRepository implements IAdminRepository {
  /**
   * 🔍 Find an admin by email
   * Leverages the persistence mapper for domain rehydration.
   */
  async findByEmail(email: string): Promise<Admin | null> {
    const doc = (await AdminModel.findOne({ email })) as AdminDB | null;
    
    if (!doc) return null;

    return AdminPersistenceMapper.toDomain(doc);
  }

  // Add save or other methods if needed by interface
}
