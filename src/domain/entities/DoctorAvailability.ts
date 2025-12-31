// domain/entities/DoctorAvailability.ts
import { AppError } from "../../common/AppError";

export class DoctorAvailability {
  private isBooked: boolean;

  constructor(
    private readonly id: string | null,
    private readonly doctorId: string,
    private readonly date: string,      // YYYY-MM-DD
    private readonly startTime: string, // HH:mm
    private readonly endTime: string,   // HH:mm
    isBooked: boolean = false
  ) {
    this.isBooked = isBooked;
  }

  /* ================= GETTERS ================= */

  getId() {
    return this.id;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getDate() {
    return this.date;
  }

  getStartTime() {
    return this.startTime;
  }

  getEndTime() {
    return this.endTime;
  }

  isSlotBooked() {
    return this.isBooked;
  }

  /* ================= BEHAVIOR ================= */

  book() {
    if (this.isBooked) {
      throw new AppError("This slot is already booked", 409);
    }
    this.isBooked = true;
  }
//for cancellation
  release() {
    if (!this.isBooked) {
      throw new AppError("Slot is not booked", 400);
    }
    this.isBooked = false;
  }
}
