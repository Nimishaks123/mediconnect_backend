// domain/errors/InvalidAppointmentStateError.ts
import { DomainError } from "./DomainError";
import { AppointmentStatus } from "../enums/AppointmentStatus";

export class InvalidAppointmentStateError extends DomainError {
  readonly name = "InvalidAppointmentStateError";

  constructor(
    current: AppointmentStatus,
    attempted: AppointmentStatus
  ) {
    super(
      `Cannot change appointment from ${current} to ${attempted}`
    );
  }
}
