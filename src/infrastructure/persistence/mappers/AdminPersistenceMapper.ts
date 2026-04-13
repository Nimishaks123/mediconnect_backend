import { Admin } from "../../../domain/entities/Admin";
import { AdminDB } from "../models/AdminModel";
import { UserRole } from "../../../domain/enums/UserRole";

export class AdminPersistenceMapper {

  static toDomain(doc: AdminDB): Admin {
    return Admin.rehydrate(
      doc.name,
      doc.email,
      doc.passwordHash,
      doc.role as UserRole,
      doc._id.toString()
    );
  }

  static toPersistence(admin: Admin): Partial<AdminPersistenceDTO> {
    return {
      name: admin.name,
      email: admin.email,
      passwordHash: admin.passwordHash,
      role: admin.role,
    };
  }
}

interface AdminPersistenceDTO {
  name: string;
  email: string;
  passwordHash: string;
  role: string;
}
