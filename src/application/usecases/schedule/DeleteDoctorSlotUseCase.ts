import { IDoctorScheduleRepository } from "@domain/interfaces/IDoctorScheduleRepository";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { AppError } from "@common/AppError";

export class DeleteDoctorSlotUseCase {
  constructor(
    private readonly scheduleRepository: IDoctorScheduleRepository,
    private readonly doctorRepository: IDoctorRepository
  ) {}

  async execute(compositeId: string, doctorUserId: string): Promise<void> {
    const doctor = await this.doctorRepository.findByUserId(doctorUserId);
    if (!doctor) {
      throw new AppError("Doctor profile not found", 404);
    }

    const [scheduleId] = compositeId.split("|");
    const schedule = await this.scheduleRepository.findById(scheduleId);

    if (!schedule) {
      throw new AppError("Slot not found", 404);
    }

    if (schedule.doctorId !== doctor.getId()) {
      throw new AppError("Unauthorized access to delete this slot", 403);
    }

    await this.scheduleRepository.deleteSlotById(compositeId);
  }
}
