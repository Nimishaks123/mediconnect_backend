// import { Doctor } from "../entities/Doctor";

// export interface IDoctorRepository {
//   createDoctor(doctor: Doctor): Promise<Doctor>;

//   findByUserId(userId: string): Promise<Doctor | null>;

//   findDoctor(filter: Partial<Doctor>): Promise<Doctor | null>;
//   findDoctors(filter?: Partial<Doctor>): Promise<Doctor[]>;

//   updateByUserId(userId: string, update: Partial<Doctor>): Promise<Doctor>;
//   uploadDocuments(
//     userId: string,
//     update: {
//       licenseDocument?: string;
//       profilePhoto?: string;
//       certifications?: string[];
//     }
//   ): Promise<Doctor>;
// }
import { Doctor } from "@domain/entities/Doctor";
export interface IDoctorRepository {
  createDoctor(doctor: Doctor): Promise<Doctor>;

  findByUserId(userId: string): Promise<Doctor | null>;

  findByOnboardingStatus(
    status: Doctor["onboardingStatus"]
  ): Promise<Doctor[]>;
    findByVerificationStatus(
    status: Doctor["verificationStatus"]
  ): Promise<Doctor[]>;

  updateByUserId(
    userId: string,
    update: Partial<Doctor>
  ): Promise<Doctor>;

 uploadDocuments(
  userId: string,
  update: Partial<Doctor>
): Promise<Doctor>;
findVerifiedDoctors(): Promise<Doctor[]>;

}
