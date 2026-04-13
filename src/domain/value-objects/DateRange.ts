import { InvalidDoctorScheduleError } from "../errors/InvalidDoctorScheduleError";

export class DateRange {
  private constructor(public readonly from: Date, public readonly to: Date) {
    this.validate();
  }

  static create(fromInput: string | Date, toInput: string | Date): DateRange {
    const from = new Date(fromInput);
    const to = new Date(toInput);
    
    // Ensure "to" covers the end of the day if it's the same or a basic date string
    to.setUTCHours(23, 59, 59, 999);

    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      throw new InvalidDoctorScheduleError("Invalid date format provided in range");
    }

    return new DateRange(from, to);
  }

  private validate() {
    if (this.from > this.to) {
      throw new InvalidDoctorScheduleError("Start date cannot be after end date");
    }
  }
}
