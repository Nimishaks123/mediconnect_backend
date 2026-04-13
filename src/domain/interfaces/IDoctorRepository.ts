import { Doctor } from "@domain/entities/Doctor";

export interface IDoctorRepository {
  /**
   * Persists a new doctor aggregate.
   */
  createDoctor(doctor: Doctor): Promise<Doctor>;

  /**
   * Finder methods for aggregate retrieval.
   */
  findByUserId(userId: string): Promise<Doctor | null>;
  findById(id: string): Promise<Doctor | null>;
  findOneByRegistrationNumber(regNumber: string): Promise<Doctor | null>;

  findByOnboardingStatus(
    status: Doctor["onboardingStatus"]
  ): Promise<Doctor[]>;

  findByVerificationStatus(
    status: Doctor["verificationStatus"]
  ): Promise<Doctor[]>;

  findVerifiedDoctors(): Promise<Doctor[]>;

  /**
   * ✅ Aggregate Save Pattern: Used for all updates to ensure atomic state persistence.
   * Partial update methods (like updateByUserId) have been decommissioned for DDD compliance.
   */
  save(doctor: Doctor): Promise<Doctor>;
}
