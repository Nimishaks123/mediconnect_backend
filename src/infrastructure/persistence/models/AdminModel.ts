import mongoose, { Schema,Model } from "mongoose";
import {Types} from "mongoose";
import { UserRole } from "@domain/enums/UserRole";
export interface AdminDB{
  _id:Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;

  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<AdminDB>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), default:UserRole.ADMIN },
  },
  { timestamps: true }
);

export const AdminModel: Model<AdminDB> =
  mongoose.models.Admin || mongoose.model<AdminDB>("Admin", AdminSchema);
