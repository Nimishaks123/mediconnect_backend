import { IRejectDoctorUseCase } from "@application/interfaces/admin/IRejectDoctorUseCase";
import {
  RejectDoctorDTO,
  RejectDoctorResponseDTO,
} from "@application/dtos/admin/RejectDoctorDTO";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IEventBus } from "@application/interfaces/IEventBus";
import { AppError } from "@common/AppError";
import { DoctorRejectedEvent } from "@domain/events/DoctorRejectedEvent";
import { DoctorMapper } from "@application/mappers/DoctorMapper";

import { ICreateNotificationUseCase } from "@application/interfaces/notification/ICreateNotificationUseCase";
import { NotificationType } from "@domain/enums/NotificationType";

export class RejectDoctorUseCase implements IRejectDoctorUseCase {
  constructor(
    private readonly doctorRepo: IDoctorRepository,
    private readonly eventBus: IEventBus,
    private readonly createNotificationUseCase: ICreateNotificationUseCase
  ) {}

  async execute(dto: RejectDoctorDTO): Promise<RejectDoctorResponseDTO> {
    const { userId, adminId, reason } = dto;

    if (!reason || reason.trim() === "") {
      throw new AppError("Rejection reason is required", 400);
    }

    const doctor = await this.doctorRepo.findByUserId(userId);
    if (!doctor) {
      throw new AppError("Doctor not found", 404);
    }

    // Apply Domain Logic
    doctor.reject(adminId, reason);

    // Persist Aggregate Root
    const savedDoctor = await this.doctorRepo.save(doctor);

    // Emit Event for Side Effects (Notifications)
    await this.eventBus.publish(
      new DoctorRejectedEvent(
        savedDoctor.getId()!,
        savedDoctor.getUserId(),
        adminId,
        reason
      )
    );

    await this.createNotificationUseCase.execute({
      userId: userId,
      title: "Verification Rejected",
      message: `Your professional profile verification was rejected. Reason: ${reason}`,
      type: NotificationType.SYSTEM
    });

    // Delegate Response Mapping
    return DoctorMapper.toRejectDoctorResponse(savedDoctor);
  }
}
