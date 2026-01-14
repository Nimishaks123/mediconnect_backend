export interface DoctorAvailabilityResponseDTO {
  id: string | null;
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
  isBooked: boolean;
}
