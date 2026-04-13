export type AppointmentWithDoctorDTO = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  refundAmount: number;
  cancellationCharge: number;
  createdAt: Date;
  doctor: {
    id: string;
    name: string;
    specialty?: string;
    profilePhoto?: string | null;
  } | null; 
};
