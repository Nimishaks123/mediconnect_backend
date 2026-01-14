import { RRule } from "rrule";
import { InvalidDoctorScheduleError } from "../errors/InvalidDoctorScheduleError";

export class DoctorSchedule {
  constructor(
    private readonly id: string | null,
    private readonly doctorId: string,
    private readonly rruleString: string,
    private readonly dailyStartTime: string,
    private readonly dailyEndTime: string,
    private readonly slotDurationMinutes: number,
    private readonly timezone: string = "Asia/Kolkata"
  ) {
    this.validate();
  }

  /* ================= VALIDATION ================= */

  private validate() {
    if (!this.doctorId) {
      throw new InvalidDoctorScheduleError("Doctor ID is required");
    }

    if (this.slotDurationMinutes <= 0) {
      throw new InvalidDoctorScheduleError(
        "Slot duration must be greater than zero"
      );
    }

    if (this.dailyStartTime >= this.dailyEndTime) {
      throw new InvalidDoctorScheduleError(
        "Daily start time must be before end time"
      );
    }

    try {
      RRule.fromString(this.rruleString);
    } catch {
      throw new InvalidDoctorScheduleError("Invalid recurrence rule (rrule)");
    }
  }

  /* ================= GETTERS ================= */

  getId() {
    return this.id;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getRRule() {
    return this.rruleString;
  }

  getDailyTimeWindow() {
    return {
      start: this.dailyStartTime,
      end: this.dailyEndTime,
    };
  }

  getSlotDuration() {
    return this.slotDurationMinutes;
  }

  getTimezone() {
    return this.timezone;
  }

  /* ================= DOMAIN BEHAVIOR ================= */

  getWorkingDates(from: Date, to: Date): Date[] {
    const rule = RRule.fromString(this.rruleString);
    return rule.between(from, to, true);
  }
}
