export interface DoctorScheduleResponseDTO {
  id: string;
  doctorId: string;
  rrule: string;
  dailyStartTime: string;
  dailyEndTime: string;
  slotDurationMinutes: number;
  timezone: string;
}
