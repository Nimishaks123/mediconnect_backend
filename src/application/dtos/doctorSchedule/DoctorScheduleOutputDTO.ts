// export interface DoctorScheduleOutputDTO {
//   id: string;
//   doctorId: string;
//   rrule: string;
//   startTime: string;
//   endTime: string;
//   slotDuration: number;
//   validFrom: string;
//   validTo: string;
//   timezone: string;
// }
import { TimeWindow } from "../../../domain/entities/DoctorSchedule";

export interface DoctorScheduleOutputDTO {
  id: string;
  doctorId: string;
  rrule: string;
  timeWindows: TimeWindow[];
  slotDuration: number;
  validFrom: string;
  validTo: string;
  timezone: string;
}
