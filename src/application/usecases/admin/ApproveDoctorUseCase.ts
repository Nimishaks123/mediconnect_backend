// src/application/usecases/admin/ApproveDoctorUseCase.ts
import { IApproveDoctorUseCase } from "@application/interfaces/admin/IApproveDoctorUseCase";
import { ApproveRejectDoctorDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
import { ApproveRejectDoctorResponseDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { INotificationService } from "@domain/interfaces/INotificationService";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { AppError } from "@common/AppError";

export class ApproveDoctorUseCase implements IApproveDoctorUseCase {
  constructor(private readonly doctorRepo: IDoctorRepository,
   private readonly userRepo:IUserRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(dto: ApproveRejectDoctorDTO): Promise<ApproveRejectDoctorResponseDTO> {
    const { userId, adminId } = dto;

    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) throw new AppError("Doctor not found", 404);
    const user=await this.userRepo.findById(userId);
    if(!user) throw new AppError("User not found");
    // call domain method
    doctor.approve(adminId);

    const updated = await this.doctorRepo.updateByUserId(userId, {
      verificationStatus: doctor.verificationStatus,
      onboardingStatus: doctor.onboardingStatus,
      verifiedBy: doctor.verifiedBy,
      verifiedAt: doctor.verifiedAt,
      rejectionReason: doctor.rejectionReason,
    });
    await this.notificationService.sendDoctorApproved(user.email)

    return {
      message: "Doctor approved",
      doctor: {
        id: updated.id ?? "",
        userId: updated.userId,
        verificationStatus: updated.verificationStatus,
        onboardingStatus: updated.onboardingStatus,
        verifiedBy: updated.verifiedBy ?? null,
        verifiedAt: updated.verifiedAt ? updated.verifiedAt.toISOString() : null,
        rejectionReason: updated.rejectionReason ?? null,
      },
    };
  }
}
