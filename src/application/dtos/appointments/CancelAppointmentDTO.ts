// application/dtos/appointments/CancelAppointmentDTO.ts
export interface CancelAppointmentDTO {
  appointmentId: string;
  actorId: string; // doctorId or patientId
}
