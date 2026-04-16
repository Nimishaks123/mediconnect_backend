export type AppointmentForDoctorDTO = {
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  videoCallAvailable: boolean;
};
