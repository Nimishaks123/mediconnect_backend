import { DoctorOnboardingStatus } from "../enums/DoctorOnboardingStatus";
import { DoctorVerificationStatus } from "../enums/DoctorVerificationStatus";

export class Doctor {
  constructor(
    public readonly userId: string,
    public specialty: string,
    public qualification: string,
    public experience: number,
    public consultationFee: number,
    public registrationNumber: string,

    public licenseDocument: string | null,
    public certifications: string[],
    public aboutMe: string,
    public profilePhoto: string | null,

    //  ENUMS 
    public onboardingStatus: DoctorOnboardingStatus,
    public verificationStatus: DoctorVerificationStatus,

    public verifiedBy?: string | null,
    public verifiedAt?: Date | null,
    public rejectionReason?: string | null,
    public id?: string
  ) {}

  // -------------------------
  // ONBOARDING STATE METHODS
  // -------------------------

  startBasicInfo() {
   if (this.onboardingStatus === DoctorOnboardingStatus.NOT_STARTED) {
    this.onboardingStatus = DoctorOnboardingStatus.BASIC_INFO;
  }
}
  

  completeBasicInfo() {
    if (this.onboardingStatus !== DoctorOnboardingStatus.BASIC_INFO) {
      throw new Error("Basic info not in progress");
    }

    this.onboardingStatus = DoctorOnboardingStatus.DOCUMENTS_PENDING;
  }

  uploadDocuments(license?: string, certifications?: string[]) {
    if (
      !license &&
      (!certifications || certifications.length === 0)
    ) {
      throw new Error("At least one document is required");
    }

    if (license) this.licenseDocument = license;
    if (certifications) this.certifications = certifications;

    this.onboardingStatus = DoctorOnboardingStatus.DOCUMENTS_PENDING;
  }

  submitForVerification() {
    if (
      this.onboardingStatus !== DoctorOnboardingStatus.DOCUMENTS_PENDING
    ) {
      throw new Error("Documents not uploaded");
    }

    this.onboardingStatus = DoctorOnboardingStatus.SUBMITTED;
    this.verificationStatus = DoctorVerificationStatus.PENDING;
    this.rejectionReason = null;
  }

  // -------------------------
  // ADMIN ACTIONS
  // -------------------------

  approve(adminId: string) {
    if (this.verificationStatus !== DoctorVerificationStatus.PENDING) {
      throw new Error("Doctor not pending verification");
    }

    this.verificationStatus = DoctorVerificationStatus.APPROVED;
    this.onboardingStatus = DoctorOnboardingStatus.APPROVED;
    this.verifiedBy = adminId;
    this.verifiedAt = new Date();
    this.rejectionReason = null;
  }

  reject(adminId: string, reason: string) {
    if (!reason) {
      throw new Error("Rejection reason required");
    }

    this.verificationStatus = DoctorVerificationStatus.REJECTED;
    this.onboardingStatus = DoctorOnboardingStatus.REJECTED;
    this.verifiedBy = adminId;
    this.verifiedAt = new Date();
    this.rejectionReason = reason;
  }
}
