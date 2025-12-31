import { Admin } from "../../../domain/entities/Admin";
import { AdminDB } from "../models/AdminModel";

export class AdminPersistenceMapper {
  static toDomain(doc: AdminDB): Admin {
    return new Admin(
      doc.name,
      doc.email,
      doc.passwordHash,
      "ADMIN",
      doc._id.toString()
    );
  }

  static toPersistence(admin: Admin) {
    return {
      name: admin.name,
      email: admin.email,
      passwordHash: admin.passwordHash,
      role: "ADMIN"
    };
  }
}
