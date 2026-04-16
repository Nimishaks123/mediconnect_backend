export interface CancelAppointmentByDoctorDTO {
  appointmentId: string;
  doctorId: string;
  reason?: string;
}
