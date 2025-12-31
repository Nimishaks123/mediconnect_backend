// domain/errors/SlotAlreadyBookedError.ts
import { DomainError } from "./DomainError";

export class SlotAlreadyBookedError extends DomainError {
  readonly name = "SlotAlreadyBookedError";

  constructor() {
    super("This availability slot is already booked");
  }
}
