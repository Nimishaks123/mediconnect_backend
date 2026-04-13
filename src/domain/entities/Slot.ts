export class Slot {
  constructor(
    public readonly id: string,
    public readonly date: string,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly scheduleId?: string
  ) {}

  /**
   * Static Factory for Slot
   */
  static create(doctorId: string, date: string, start: string, end: string, scheduleId?: string): Slot {
    const id = `${doctorId}_${date}_${start}_${end}`;
    return new Slot(id, date, start, end, scheduleId);
  }

  equals(other: Slot): boolean {
    return this.date === other.date && this.startTime === other.startTime;
  }
}
