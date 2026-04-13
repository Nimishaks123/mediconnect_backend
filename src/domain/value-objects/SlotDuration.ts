import { InvalidDoctorScheduleError } from "../errors/InvalidDoctorScheduleError";

export class SlotDuration {
  private constructor(public readonly value: number) {
    this.validate();
  }

  static create(value: number): SlotDuration {
    return new SlotDuration(value);
  }

  private validate() {
    if (typeof this.value !== "number" || Number.isNaN(this.value) || this.value <= 0) {
      throw new InvalidDoctorScheduleError("Slot duration must be a positive number");
    }

    // Example invariant: Slot must be a multiple of 5 minutes
    if (this.value % 5 !== 0) {
      throw new InvalidDoctorScheduleError("Slot duration must be a multiple of 5 minutes");
    }
  }
}
