import { Otp } from "../../../domain/entities/Otp";
import { OtpDB } from "../../../infrastructure/persistence/models/OtpModel";

export class OtpMapper {
  static toDomain(doc: OtpDB): Otp {
    return new Otp(
      doc.email,
      doc.code,
      doc.expiresAt,
      doc.createdAt,
      doc.attempts,
      doc._id.toString()
    );
  }

  static toPersistence(otp: Otp) {
    return {
      email: otp.email,
      code: otp.code,
      expiresAt: otp.expiresAt,
      attempts: otp.attempts,
    };
  }
}
