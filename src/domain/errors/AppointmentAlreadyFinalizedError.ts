// domain/errors/AppointmentAlreadyFinalizedError.ts
import { DomainError } from "./DomainError";
import { AppointmentStatus } from "../enums/AppointmentStatus";

export class AppointmentAlreadyFinalizedError extends DomainError {
  readonly name = "AppointmentAlreadyFinalizedError";

  constructor(status: AppointmentStatus) {
    super(
      `Appointment is already ${status} and cannot be changed`
    );
  }
}
