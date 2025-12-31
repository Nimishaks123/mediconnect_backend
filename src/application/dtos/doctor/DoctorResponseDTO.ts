import { DoctorOnboardingStatus } from "@domain/enums/DoctorOnboardingStatus";
import { DoctorVerificationStatus } from "@domain/enums/DoctorVerificationStatus";

export interface DoctorResponseDTO {
  id: string;
  userId: string;
  specialty: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  registrationNumber: string;
  aboutMe: string;
  profilePhoto: string | null;
  licenseDocument: string | null;
  certifications: string[];
  onboardingStatus: DoctorOnboardingStatus;
  verificationStatus: DoctorVerificationStatus;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  rejectionReason: string | null;
}
