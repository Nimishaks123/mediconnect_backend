export interface GetAdminAppointmentsDTO {
  page: number;
  limit: number;
  type: "UPCOMING" | "PAST" | "RECENT";
  status?: string;
  search?: string;
  sort?: "LATEST" | "OLDEST";
}

export interface AdminAppointmentListItemDTO {
  appointmentId: string;
  patientName: string;
  doctorName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
}

export interface AdminAppointmentListResponseDTO {
  data: AdminAppointmentListItemDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminAppointmentDetailsDTO {
  appointmentId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  price: number;
  consultationLink?: string;
  cancellationReason?: string;
  
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  
  doctor: {
    id: string;
    name: string;
    specialty: string;
    email: string;
  };
}
