import { DateRange } from "../value-objects/DateRange";
import { SlotDuration } from "../value-objects/SlotDuration";
import { InvalidDoctorScheduleError } from "../errors/InvalidDoctorScheduleError";
//import { v4 as uuid } from "uuid";
import { IRRulePolicy } from "../policies/IRRulePolicy";
import { Slot } from "./Slot";

export type TimeWindow = {
  start: string; // "09:00"
  end: string;   // "12:00"
};

export class DoctorSchedule {
  constructor(
    public readonly id: string | null | undefined,
    public readonly doctorId: string,
    public readonly rrule: string,
    public readonly timeWindows: TimeWindow[],
    public readonly slotDuration: number,
    public readonly validFrom: Date,
    public readonly validTo: Date,
    public readonly timezone: string,
    public readonly cancelledSlots: string[] = []
  ) {
    this.validate();
  }

  static create(data: {
    doctorId: string;
    rrule: string;
    timeWindows: TimeWindow[];
    slotDuration: number;
    validFrom: string | Date;
    validTo: string | Date;
    timezone?: string;
  }): DoctorSchedule {
    const range = DateRange.create(data.validFrom, data.validTo);
    const duration = SlotDuration.create(data.slotDuration);

    return new DoctorSchedule(
      undefined, 
      data.doctorId,
      data.rrule,
      data.timeWindows,
      duration.value,
      range.from,
      range.to,
      data.timezone ?? "Asia/Kolkata",
      []
    );
  }

  /**
   *  Slot Generation
   * schedule rules into discrete time windows.
   */
  generateSlots(queryRange: DateRange, rrulePolicy: IRRulePolicy): Slot[] {
    // 1. Determine effective date range for this schedule
    const effectiveFrom = queryRange.from > this.validFrom ? queryRange.from : this.validFrom;
    const effectiveTo = queryRange.to < this.validTo ? queryRange.to : this.validTo;

    if (effectiveFrom > effectiveTo) return [];

    // 2. Resolve working dates 
    const workingDates = rrulePolicy.generateDates(
      this.rrule,
      effectiveFrom,
      effectiveTo,
      this.validFrom
    );

    const slots: Slot[] = [];
    for (const dateObj of workingDates) {
      slots.push(...this.generateSlotsForDate(dateObj));
    }

    return slots;
  }

  private generateSlotsForDate(dateObj: Date): Slot[] {
    const slots: Slot[] = [];
    const dateStr = this.formatDate(dateObj);

    for (const window of this.timeWindows) {
      const start = new Date(`${dateStr}T${window.start}:00Z`);
      const end = new Date(`${dateStr}T${window.end}:00Z`);

      let current = new Date(start);

      while (current<end) {
        const slotEnd = new Date(current);
        slotEnd.setMinutes(slotEnd.getMinutes() + this.slotDuration);

        if (slotEnd.getTime() > end.getTime()) break;

        const newSlot = Slot.create(
          this.doctorId,
          dateStr,
          this.formatTime(current),
          this.formatTime(slotEnd),
          this.id || undefined
        );

        if (!this.cancelledSlots.includes(newSlot.id)) {
          slots.push(newSlot);
        }

        current = new Date(slotEnd);
      }
    }
    return slots;
  }

  private formatDate(date: Date): string {
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private formatTime(date: Date): string {
    const hh = String(date.getUTCHours()).padStart(2, '0');
    const mm = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  private validate() {
    if (!Array.isArray(this.timeWindows) || this.timeWindows.length === 0) {
      throw new InvalidDoctorScheduleError("At least one valid time window is required");
    }

    for (const window of this.timeWindows) {
      if (!window.start || !window.end || window.start >= window.end) {
        throw new InvalidDoctorScheduleError(`Invalid time window: ${window.start} - ${window.end}`);
      }
    }
  }
}
