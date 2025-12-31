import { UserRole } from "@domain/enums/UserRole";
import { User } from "../../../domain/entities/User";
import { UserDB } from "../models/UserModel";

export class UserPersistenceMapper {
  static toDomain(doc: UserDB): User {
    return new User(
      doc.name,
      doc.email,
      doc.phoneNumber,
      doc.passwordHash,
      doc.role as UserRole,
      doc.isVerified,
      doc.blocked,
      doc._id?.toString()
    );
  }

  static toPersistence(user: User) {
    return {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      passwordHash: user.passwordHash,
      role: user.role,
      isVerified: user.isVerified,
      blocked: user.blocked,
    };
  }
}
