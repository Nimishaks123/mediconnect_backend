import { Otp } from "../../../domain/entities/Otp";
import { OtpDB } from "../models/OtpModel";

export class OtpPersistenceMapper {
  static toDomain(doc: OtpDB): Otp {
    return Otp.rehydrate({
      id: doc._id.toString(),
      email: doc.email,
      code: doc.code,
      expiresAt: doc.expiresAt,
      createdAt: doc.createdAt,
      attempts: doc.attempts,
      context: doc.context,
      verified: doc.verified,
    });
  }


  static toPersistence(otp: Otp): Partial<OtpPersistenceDTO> {
    return {
       email: otp.getEmail(),
    code: otp.getCode(),
    expiresAt: otp.getExpiresAt(),
    createdAt: otp.getCreatedAt(),
    attempts: otp.getAttempts(),
    context: otp.getContext(),
    verified: otp.isVerified(),
    };
  }
}

interface OtpPersistenceDTO {
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
  attempts: number;
  context: string;
  verified: boolean;
}
