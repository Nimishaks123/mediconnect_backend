export interface GenerateAvailabilityRequestDTO {
  doctorId: string;
  fromDate: string; // ISO date (YYYY-MM-DD)
  toDate: string;   // ISO date (YYYY-MM-DD)
}
