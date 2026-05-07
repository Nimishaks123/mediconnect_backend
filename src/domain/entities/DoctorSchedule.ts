import { DateRange } from "../value-objects/DateRange";
import { SlotDuration } from "../value-objects/SlotDuration";
import { InvalidDoctorScheduleError } from "../errors/InvalidDoctorScheduleError";
//import { v4 as uuid } from "uuid";
import { IRRulePolicy } from "../policies/IRRulePolicy";
import { Slot } from "./Slot";

export type TimeWindow = {
  start: string; 
  end: string;  
};

export class DoctorSchedule {
  constructor(
    private readonly id: string | null | undefined,
    private readonly doctorId: string,
    private readonly rrule: string,
    private readonly timeWindows: TimeWindow[],
    private readonly slotDuration: number,
    private readonly validFrom: Date,
    private readonly validTo: Date,
    private readonly timezone: string,
    private readonly cancelledSlots: string[] = []
  ) {
    this.validate();
  }

  // getters 
  getId(): string | null | undefined {
    return this.id;
  }

  getDoctorId(): string {
    return this.doctorId;
  }
  getRRule(): string {
  return this.rrule;
}

getTimeWindows(): TimeWindow[] {
  return this.timeWindows;
}

getSlotDuration(): number {
  return this.slotDuration;
}

getValidFrom(): Date {
  return this.validFrom;
}

getValidTo(): Date {
  return this.validTo;
}

getTimezone(): string {
  return this.timezone;
}

getCancelledSlots(): string[] {
  return this.cancelledSlots;
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

  generateSlots(queryRange: DateRange, rrulePolicy: IRRulePolicy): Slot[] {
    const effectiveFrom =
      queryRange.from > this.validFrom ? queryRange.from : this.validFrom;

    const effectiveTo =
      queryRange.to < this.validTo ? queryRange.to : this.validTo;

    if (effectiveFrom > effectiveTo) return [];

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
      const start = new Date(`${dateStr}T${window.start}:00`);
      const end = new Date(`${dateStr}T${window.end}:00`);

      let current = new Date(start);

      while (current.getTime() < end.getTime()) {
        const slotEnd = new Date(current);
        slotEnd.setMinutes(slotEnd.getMinutes() + this.slotDuration);

        if (slotEnd.getTime() > end.getTime()) break;

        const newSlot = Slot.create(
          this.doctorId,
          dateStr,
          this.formatTime(current),
          this.formatTime(slotEnd),
          this.id ?? undefined
        );

        const slotId = newSlot.getId(); 

        if (!this.cancelledSlots.includes(slotId)) {
  slots.push(newSlot);
}

        current = new Date(slotEnd);
      }
    }

    return slots;
  }

  private formatDate(date: Date): string {
  return date.toLocaleDateString("en-CA"); // local time(y-m-d)
}

  private formatTime(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

  private validate() {
    if (!Array.isArray(this.timeWindows) || this.timeWindows.length === 0) {
      throw new InvalidDoctorScheduleError(
        "At least one valid time window is required"
      );
    }

    for (const window of this.timeWindows) {
      if (!window.start || !window.end || window.start >= window.end) {
        throw new InvalidDoctorScheduleError(
          `Invalid time window: ${window.start} - ${window.end}`
        );
      }
    }
  }
}