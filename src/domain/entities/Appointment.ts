// domain/entities/Appointment.ts
import { AppointmentStatus } from "../enums/AppointmentStatus";
import { InvalidAppointmentStateError } from "../errors/InvalidAppointmentStateError";
import { AppointmentAlreadyFinalizedError } from "../errors/AppointmentAlreadyFinalizedError";

export class Appointment {
  private status: AppointmentStatus;

  constructor(
    private readonly id: string | null,
    private readonly doctorId: string,
    private readonly patientId: string,
    private readonly availabilityId: string,
    private readonly date: string,       // YYYY-MM-DD
    private readonly startTime: string,  // HH:mm
    private readonly endTime: string,    // HH:mm
    status: AppointmentStatus = AppointmentStatus.PENDING,
    private readonly createdAt: Date = new Date()
  ) {
    this.status = status;
  }

  /* ================= GETTERS ================= */

  getId() {
    return this.id;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getPatientId() {
    return this.patientId;
  }

  getAvailabilityId() {
    return this.availabilityId;
  }

  getStatus() {
    return this.status;
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

  getTimeRange() {
    return {
      start: this.startTime,
      end: this.endTime,
    };
  }


  confirm() {
    if (this.status !== AppointmentStatus.PENDING) {
      throw new InvalidAppointmentStateError(
        this.status,
        AppointmentStatus.CONFIRMED
      );
    }

    this.status = AppointmentStatus.CONFIRMED;
  }

  complete() {
    if (this.status !== AppointmentStatus.CONFIRMED) {
      throw new InvalidAppointmentStateError(
        this.status,
        AppointmentStatus.COMPLETED
      );
    }

    this.status = AppointmentStatus.COMPLETED;
  }

  cancel() {
    if (
      this.status === AppointmentStatus.COMPLETED ||
      this.status === AppointmentStatus.CANCELLED
    ) {
      throw new AppointmentAlreadyFinalizedError(this.status);
    }

    this.status = AppointmentStatus.CANCELLED;
  }
}
