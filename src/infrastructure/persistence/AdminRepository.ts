import { IAdminRepository } from "../../domain/interfaces/IAdminRepository";
import { Admin } from "../../domain/entities/Admin";
import { AdminModel } from "./models/AdminModel";

export class AdminRepository implements IAdminRepository {

  async findByEmail(email: string): Promise<Admin | null> {
    const doc = await AdminModel.findOne({ email }).lean();
    if (!doc) return null;

    return new Admin(
      doc.name,
      doc.email,
      doc.passwordHash,
      "ADMIN",
      doc._id.toString()
    );
  }
}
