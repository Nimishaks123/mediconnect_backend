// application/dtos/appointments/UpdateAppointmentStatusDTO.ts
export interface UpdateAppointmentStatusDTO {
  appointmentId: string;
  actorId: string; // doctorId or patientId
}
