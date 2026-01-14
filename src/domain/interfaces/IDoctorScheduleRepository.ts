import { DoctorSchedule } from "../../domain/entities/DoctorSchedule";

export interface IDoctorScheduleRepository {
  findByDoctorId(doctorId: string): Promise<DoctorSchedule | null>;
  save(schedule: DoctorSchedule): Promise<DoctorSchedule>;
}
