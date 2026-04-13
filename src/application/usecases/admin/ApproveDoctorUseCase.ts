import { IApproveDoctorUseCase } from "@application/interfaces/admin/IApproveDoctorUseCase";
import { ApproveRejectDoctorDTO, ApproveRejectDoctorResponseDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IEventBus } from "@application/interfaces/IEventBus";
import { DoctorApprovedEvent } from "@domain/events/DoctorApprovedEvent";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { DoctorMapper } from "../../mappers/DoctorMapper";

import { ICreateNotificationUseCase } from "@application/interfaces/notification/ICreateNotificationUseCase";
import { NotificationType } from "@domain/enums/NotificationType";

export class ApproveDoctorUseCase implements IApproveDoctorUseCase {
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly eventBus: IEventBus,
    private readonly createNotificationUseCase: ICreateNotificationUseCase
  ) {}

  async execute(dto: ApproveRejectDoctorDTO): Promise<ApproveRejectDoctorResponseDTO> {
    const { userId, adminId } = dto;

    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) {
      throw new AppError("Doctor not found", StatusCode.NOT_FOUND);
    }

    doctor.approve(adminId);

    const savedDoctor = await this.doctorRepo.save(doctor);

    await this.eventBus.publish(
      new DoctorApprovedEvent(
        savedDoctor.getId()!,
        savedDoctor.getUserId(),
        adminId
      )
    );

    await this.createNotificationUseCase.execute({
      userId: userId,
      title: "Profile Verified",
      message: "Congratulations! Your professional profile has been verified.",
      type: NotificationType.SYSTEM
    });

    return DoctorMapper.toApproveDoctorResponse(savedDoctor);
  }
}
