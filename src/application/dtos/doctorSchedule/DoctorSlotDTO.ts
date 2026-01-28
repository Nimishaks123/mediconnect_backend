/**
 * DoctorSlotDTO
 * --------------
 * Represents a single bookable time slot for a doctor.
 * This is a READ-ONLY DTO used in slot generation responses.
 */
export interface DoctorSlotDTO {
  date: string;       // YYYY-MM-DD (e.g. 2026-02-01)
  startTime: string;  // HH:mm (e.g. 09:00)
  endTime: string;    // HH:mm (e.g. 09:15)
}
