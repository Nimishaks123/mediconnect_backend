import { AppointmentStatus } from "@domain/enums/AppointmentStatus";

export interface AppointmentResponseDTO {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
}
