import { IDoctorScheduleRepository } from "@domain/interfaces/IDoctorScheduleRepository";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { AppError } from "@common/AppError";

export class DeleteDoctorSlotUseCase {
  constructor(
    private readonly scheduleRepository: IDoctorScheduleRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  async execute(dto: {
    slotId: string;
    doctorUserId: string;
  }): Promise<void> {
    const { slotId, doctorUserId } = dto;
    const doctor = await this.doctorRepository.findByUserId(doctorUserId);
    if (!doctor) {
      throw new AppError("Doctor profile not found", 404);
    }

    if (!slotId.includes("|")) {
       throw new AppError("Invalid slot identifier format", 400);
    }

    const [scheduleId, slotReference] = slotId.split("|");
    if (!slotReference || slotReference.trim() === "") {
        throw new AppError("Slot reference is missing in identifier", 400);
    }

    const schedule = await this.scheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw new AppError("Associated schedule not found", 404);
    }

    if (schedule.doctorId !== doctor.getId()) {
      throw new AppError("Permission denied: You do not own this schedule", 403);
    }

    await this.scheduleRepository.deleteSlotById(slotId);
  }
}
