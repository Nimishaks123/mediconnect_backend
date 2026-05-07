import { UserRole } from "@domain/enums/UserRole";
import { User } from "../../../domain/entities/User";
import { UserDB } from "../models/UserModel";

export class UserPersistenceMapper {
  static toDomain(doc: UserDB): User {
    return User.rehydrate({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      phoneNumber: doc.phoneNumber,
      passwordHash: doc.passwordHash,
      role: this.mapPersistentRoleToDomain(doc.role),
      isVerified: doc.isVerified,
      blocked: doc.blocked,
    });
  }

  static toPersistence(user: User): Partial<UserDB> {
  return {
    name: user.getName(),
    email: user.getEmail(),
    phoneNumber: user.getPhoneNumber(),
    passwordHash: user.getPasswordHash(),
    role: user.getRole() as any,
    isVerified: user.isUserVerified(),
    blocked: user.isBlocked(),
  };
  }


  private static mapPersistentRoleToDomain(persistentRole: string): UserRole {
    const roleMap: Record<string, UserRole> = {
      PATIENT: UserRole.PATIENT,
      DOCTOR: UserRole.DOCTOR,
      ADMIN: UserRole.ADMIN,
    };

    const role = roleMap[persistentRole];
    if (!role) {
      throw new Error(`Critical: Invalid role found in database: ${persistentRole}`);
    }
    return role;
  }
}

