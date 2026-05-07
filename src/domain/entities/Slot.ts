
export class Slot {
  constructor(
    private readonly id: string,
    private readonly doctorId: string,
    private readonly date: string,
    private readonly startTime: string,
    private readonly endTime: string,
    private readonly scheduleId?: string
  ) {}

  // Factory method
  static create(
    doctorId: string,
    date: string,
    start: string,
    end: string,
    scheduleId?: string
  ): Slot {
    const id = `${doctorId}_${date}_${start}_${end}`;
    return new Slot(id, doctorId, date, start, end, scheduleId);
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getDoctorId(): string {
    return this.doctorId;
  }

  getDate(): string {
    return this.date;
  }

  getStartTime(): string {
    return this.startTime;
  }

  getEndTime(): string {
    return this.endTime;
  }

  getScheduleId(): string | undefined {
    return this.scheduleId;
  }

  // Equality check 
  equals(other: Slot): boolean {
    return this.id === other.id;
  }
}