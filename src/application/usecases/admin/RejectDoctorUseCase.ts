// src/application/usecases/admin/RejectDoctorUseCase.ts
import { IRejectDoctorUseCase } from "@application/interfaces/admin/IRejectDoctorUseCase";
import { ApproveRejectDoctorDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
import { ApproveRejectDoctorResponseDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { AppError } from "@common/AppError";
import { INotificationService } from "@domain/interfaces/INotificationService";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import {StatusCode} from "../../../common/enums"

export class RejectDoctorUseCase implements IRejectDoctorUseCase {
  constructor(private readonly doctorRepo: IDoctorRepository,
   private readonly userRepo:IUserRepository,
    private readonly notificationService: INotificationService,
  ) {}

  async execute(dto: ApproveRejectDoctorDTO): Promise<ApproveRejectDoctorResponseDTO> {
    const { userId, adminId, reason } = dto;
    if (!reason) throw new AppError("Rejection reason required", StatusCode.BAD_REQUEST);

    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) throw new AppError("Doctor not found", StatusCode.NOT_FOUND);
    const user=await this.userRepo.findById(userId);
    if(!user) throw new AppError("User not found",StatusCode.NOT_FOUND)

    doctor.reject(adminId, reason);

    const updated = await this.doctorRepo.updateByUserId(userId, {
      verificationStatus: doctor.verificationStatus,
      onboardingStatus: doctor.onboardingStatus,
      verifiedBy: doctor.verifiedBy,
      verifiedAt: doctor.verifiedAt,
      rejectionReason: doctor.rejectionReason,
    });
    await this.notificationService.sendDoctorRejected(user.email,reason);

    return {
      message: "Doctor rejected",
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
