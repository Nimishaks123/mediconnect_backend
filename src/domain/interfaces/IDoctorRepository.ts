import { Doctor } from "@domain/entities/Doctor";

export interface IDoctorRepository {
   // Persists a new doctor 
   
  createDoctor(doctor: Doctor): Promise<Doctor>;
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
  save(doctor: Doctor): Promise<Doctor>;

}
