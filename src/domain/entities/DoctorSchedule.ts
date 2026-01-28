export type TimeWindow = {
  start: string; // "09:00"
  end: string;   // "12:00"
};

export class DoctorSchedule {
  constructor(
    public readonly id: string,
    public readonly doctorId: string,
    public readonly rrule: string,
    public readonly timeWindows: TimeWindow[],
    public readonly slotDuration: number,
    public readonly validFrom: Date,
    public readonly validTo: Date,
    public readonly timezone: string
  ) {
    this.validate();
  }

  private validate() {
    if (!Array.isArray(this.timeWindows)) {
      throw new Error("timeWindows must be an array");
    }

    if (this.timeWindows.length === 0) {
      throw new Error("At least one time window is required");
    }

    for (const window of this.timeWindows) {
      if (!window.start || !window.end) {
        throw new Error("Invalid time window");
      }

      if (window.start >= window.end) {
        throw new Error("Time window start must be before end");
      }
    }

    if (this.slotDuration <= 0) {
      throw new Error("slotDuration must be positive");
    }
  }
}
