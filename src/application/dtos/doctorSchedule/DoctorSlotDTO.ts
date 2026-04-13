
// Represents a single bookable time slot for a doctor.

export interface DoctorSlotDTO {
  _id: string;        // Unique slot identifier (mapped as _id for frontend)
  id: string;         // Alias for backward compatibility
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;    // HH:mm
}
