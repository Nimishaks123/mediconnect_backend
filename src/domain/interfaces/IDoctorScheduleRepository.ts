import { DoctorSchedule } from "../../domain/entities/DoctorSchedule";

export interface IDoctorScheduleRepository {
  save(schedule: DoctorSchedule): Promise<DoctorSchedule>;
  findByDoctorId(doctorId:string):Promise<DoctorSchedule[]>;
}
