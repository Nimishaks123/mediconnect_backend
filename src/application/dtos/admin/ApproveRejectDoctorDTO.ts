export type ApproveRejectDoctorDTO ={
  userId: string; // doctor's userId
  adminId: string;
  reason?: string; // required for reject
}
export type ApproveRejectDoctorResponseDTO = {
  message: string;
  doctor: {
    id: string;
    userId: string;
    verificationStatus: string;
    onboardingStatus: string;
    verifiedBy?: string | null;
    verifiedAt?: string | null;
    rejectionReason?: string | null;
  };
}

