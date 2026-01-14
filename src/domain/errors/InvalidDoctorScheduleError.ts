import { DomainError } from "./DomainError";

export class InvalidDoctorScheduleError extends DomainError {
  readonly name = "InvalidDoctorScheduleError";

  constructor(message: string) {
    super(message);
  }
}
