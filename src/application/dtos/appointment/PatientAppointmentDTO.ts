export interface PatientAppointmentDTO {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  price: number;
  refundAmount: number;
  cancellationCharge: number;
  doctor: {
    id: string;
    userId: string;
    name: string;
    specialty: string;
    profilePhoto: string | null;
  } | null;
}
