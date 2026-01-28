export interface TimeWindowDTO {
  start: string;
  end: string;
}

export interface CreateDoctorScheduleInputDTO {
  doctorId: string;
  rrule: string;
  timeWindows: TimeWindowDTO[];
  slotDuration: number;
  validFrom: string;
  validTo: string;
  timezone?: string;
}
