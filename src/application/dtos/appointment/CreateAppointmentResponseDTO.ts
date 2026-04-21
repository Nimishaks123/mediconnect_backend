export interface CreateAppointmentResponseDTO {
  id: string;
  _id: string;

  doctorId: string;
  patientId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
}
