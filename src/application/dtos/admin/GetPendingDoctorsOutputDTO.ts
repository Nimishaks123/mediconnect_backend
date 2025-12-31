// export interface PendingDoctorDTO {
//   doctor: {
//     id: string;
//     userId: string;
//     specialty: string;
//     qualification: string;
//     experience: number;
//     consultationFee: number;
//     registrationNumber: string;
//     licenseDocument: string | null;
//     certifications: string[];
//     aboutMe: string;
//     profilePhoto: string | null;
//     onboardingStatus: string;
//     verificationStatus: string;
//     verifiedBy: string | null;
//     verifiedAt: Date | null;
//     rejectionReason: string | null;
//   };

import { UserRole } from "@domain/enums/UserRole";

//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role: "PATIENT" | "DOCTOR" | "ADMIN";
//     blocked: boolean;
//     isVerified: boolean;
//   };
// }

// export interface GetPendingDoctorsOutputDTO {
//   count: number;
//   doctors: PendingDoctorDTO[];
// }
export interface PendingDoctorDTO {
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
  };

  user: {
    id: string;
    name: string;
    email: string;
    role:UserRole;
    blocked: boolean;
    isVerified: boolean;
  };
}

export interface GetPendingDoctorsOutputDTO {
  count: number;
  doctors: PendingDoctorDTO[];
}
