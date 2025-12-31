// application/dtos/appointments/GetDoctorAvailabilityDTO.ts
export interface GetDoctorAvailabilityDTO {
  doctorId: string;
  date: string;
}
export interface GetDoctorAvailabilityResponseDTO {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}
