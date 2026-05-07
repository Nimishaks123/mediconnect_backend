import { DoctorSchedule } from "../../domain/entities/DoctorSchedule";
export interface IDoctorScheduleRepository {
  save(schedule: DoctorSchedule): Promise<DoctorSchedule>;
  findById(id: string): Promise<DoctorSchedule | null>;
  // findByDoctorId(doctorId:string):Promise<DoctorSchedule[]>;
 findByDoctorId(doctorId: string): Promise<DoctorSchedule | null>;
  deleteById(id: string): Promise<void>;
  deleteSlotById(slotId: string): Promise<void>;
}
