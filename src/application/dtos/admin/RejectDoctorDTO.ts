export interface RejectDoctorDTO {
  userId: string;
  adminId: string;
  reason: string;
}

export interface RejectDoctorResponseDTO {
  message: string;
  doctor: {
    id: string;
    userId: string;
    verificationStatus: string;
    onboardingStatus: string;
    verifiedBy: string | null;
    verifiedAt: string | null;
    rejectionReason: string | null;
  };
}
