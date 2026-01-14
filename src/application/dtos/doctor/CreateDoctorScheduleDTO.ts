export interface CreateDoctorScheduleDTO {
  doctorId: string;
  rrule: string;               // e.g. FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
  dailyStartTime: string;      // HH:mm
  dailyEndTime: string;        // HH:mm
  slotDurationMinutes: number;
  timezone?: string;           // optional
}
