// src/domain/interfaces/IOtpRepository.ts

import { Otp } from "../entities/Otp";

export interface IOtpRepository {
  create(record: Otp): Promise<Otp>;
  save(record: Otp): Promise<void>;

  findLatestByEmail(
    email: string,
    context: string
  ): Promise<Otp | null>;

  deleteByEmail(email: string): Promise<void>;
  incrementAttempts(id: string): Promise<void>;
  markVerified(id: string): Promise<void>;
}
