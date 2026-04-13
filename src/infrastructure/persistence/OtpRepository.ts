import { IOtpRepository } from "../../domain/interfaces/IOtpRepository";
import { Otp } from "../../domain/entities/Otp";
import { OtpModel, OtpDB } from "./models/OtpModel";
import { OtpPersistenceMapper } from "./mappers/OtpPersistenceMapper";

export class OtpRepository implements IOtpRepository {
  /**
   * 🏗️ Create new OTP record
   */
  async create(record: Otp): Promise<Otp> {
    const persistenceData = OtpPersistenceMapper.toPersistence(record);
    const doc = await OtpModel.create(persistenceData);

    return OtpPersistenceMapper.toDomain(doc);
  }

  /**
   * 💾 Save/Update OTP state
   */
  async save(record: Otp): Promise<void> {
    if (!record.id) {
      await this.create(record);
      return;
    }

    const persistenceData = OtpPersistenceMapper.toPersistence(record);
    await OtpModel.updateOne(
      { _id: record.id },
      { $set: persistenceData }
    ).exec();
  }

  /**
   * 🔍 Find latest OTP for email and context
   */
  async findLatestByEmail(
    email: string,
    context: string
  ): Promise<Otp | null> {
    const doc = await OtpModel.findOne({ email, context })
      .sort({ createdAt: -1 })
      .lean<OtpDB>()
      .exec();

    return doc ? OtpPersistenceMapper.toDomain(doc as any) : null;
  }

  /**
   * 🗑️ Delete by email
   */
  async deleteByEmail(email: string): Promise<void> {
    await OtpModel.deleteMany({ email }).exec();
  }

  /**
   * ➕ Increment attempts on failure
   */
  async incrementAttempts(id: string): Promise<void> {
    await OtpModel.updateOne(
      { _id: id },
      { $inc: { attempts: 1 } }
    ).exec();
  }

  /**
   * ✅ Mark as verified
   */
  async markVerified(id: string): Promise<void> {
    await OtpModel.updateOne(
      { _id: id },
      { verified: true }
    ).exec();
  }
}
