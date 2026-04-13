export interface AppointmentEmailData {
  patientEmail: string;
  patientName: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface IEmailService {
  sendAppointmentConfirmedEmail(data: AppointmentEmailData): Promise<void>;
  sendAppointmentCancelledEmail(data: AppointmentEmailData): Promise<void>;
  sendAppointmentRescheduledEmail(data: AppointmentEmailData): Promise<void>;
}
