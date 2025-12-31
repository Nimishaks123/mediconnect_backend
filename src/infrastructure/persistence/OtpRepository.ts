// src/infrastructure/persistence/OtpRepository.ts

import { IOtpRepository } from "../../domain/interfaces/IOtpRepository";
import { Otp } from "../../domain/entities/Otp";
import { OtpModel } from "./models/OtpModel";
import { OtpDB } from "./models/OtpModel";

export class OtpRepository implements IOtpRepository {

  async create(record: Otp): Promise<Otp> {
    const doc = await OtpModel.create({
      email: record.email,
      code: record.code,
      expiresAt: record.expiresAt,
      attempts: record.attempts,
      context: record.context,
      verified: record.verified,
    });

    return this.toEntity(doc);
  }

  async findLatestByEmail(
    email: string,
    context: Otp["context"]
  ): Promise<Otp | null> {
    const doc = await OtpModel.findOne({ email, context })
      .sort({ createdAt: -1 })
      .lean<OtpDB>()
      .exec();

    return doc ? this.toEntity(doc) : null;
  }

  async deleteByEmail(email: string): Promise<void> {
    await OtpModel.deleteMany({ email }).exec();
  }

  async incrementAttempts(id: string): Promise<void> {
    await OtpModel.updateOne(
      { _id: id },
      { $inc: { attempts: 1 } }
    ).exec();
  }

  async markVerified(id: string): Promise<void> {
    await OtpModel.updateOne(
      { _id: id },
      { verified: true }
    ).exec();
  }

  private toEntity(doc: Partial<OtpDB>): Otp {
    return new Otp(
      doc.email!,
      doc.code!,
      doc.expiresAt!,
      doc.createdAt!,
      doc.attempts ?? 0,
      doc._id?.toString(),
      doc.context!,
      doc.verified ?? false
    );
  }
}
