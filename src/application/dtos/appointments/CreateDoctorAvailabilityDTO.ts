// application/dtos/appointments/CreateDoctorAvailabilityDTO.ts
export interface CreateDoctorAvailabilityDTO {
  doctorId: string;
  date: string; // YYYY-MM-DD
  slots: {
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
  }[];
}
