import { DoctorSchedule } from "../../../domain/entities/DoctorSchedule";
import { DoctorScheduleRepository } from "../../../infrastructure/persistence/DoctorScheduleRepository";

interface CreateDoctorScheduleParams {
  doctorId: string;
  rrule: string;
  dailyStartTime: string;
  dailyEndTime: string;
  slotDurationMinutes: number;
  timezone?: string;
}

export class CreateDoctorScheduleUseCase {
  constructor(
    private readonly scheduleRepository: DoctorScheduleRepository
  ) {}

  async execute(params: CreateDoctorScheduleParams): Promise<DoctorSchedule> {
    const {
      doctorId,
      rrule,
      dailyStartTime,
      dailyEndTime,
      slotDurationMinutes,
      timezone,
    } = params;

    const existingSchedule =
      await this.scheduleRepository.findByDoctorId(doctorId);

    if (existingSchedule) {
      throw new Error("Doctor schedule already exists");
    }
    const schedule = new DoctorSchedule(
      null,
      doctorId,
      rrule,
      dailyStartTime,
      dailyEndTime,
      slotDurationMinutes,
      timezone
    );
    return this.scheduleRepository.save(schedule);
  }
}
