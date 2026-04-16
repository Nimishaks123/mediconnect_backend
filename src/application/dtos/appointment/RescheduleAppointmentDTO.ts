export interface RescheduleAppointmentDTO {
  appointmentId: string;
  doctorId: string;
  newDateTime: string;
  reason?: string;
}
