import { GetVerifiedDoctorsDTO } from "@application/dtos/doctor/GetVerifiedDoctorsDTO";
import { Doctor } from "@domain/entities/Doctor";

export interface IDoctorRepository {
   
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

  findVerifiedDoctors(
  dto?: GetVerifiedDoctorsDTO
): Promise<{
   doctors: Doctor[];
   total: number;
}>;
 findDistinctSpecialties():Promise<string[]>;
  save(doctor: Doctor): Promise<Doctor>;

}
