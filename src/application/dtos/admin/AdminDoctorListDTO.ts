import { UserRole } from "@domain/enums/UserRole";

export type AdminDoctorDTO = {
  doctor: {
    id: string;
    userId: string;
    specialty: string;
    qualification: string;
    experience: number;
    consultationFee: number;
    registrationNumber: string;
    licenseDocument: string | null;
    certifications: string[];
    aboutMe: string;
    profilePhoto: string | null;
    onboardingStatus: string;
    verificationStatus: string;
    verifiedBy: string | null;
    verifiedAt: Date | null;
    rejectionReason: string | null;
    createdAt: Date;
  };

  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    blocked: boolean;
    isVerified: boolean;
  };
}

export type AdminDoctorListResponseDTO = {
  total: number;
  doctors: AdminDoctorDTO[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    total: number;
  };
};
