// domain/errors/DomainError.ts
export abstract class DomainError extends Error {
  abstract readonly name: string;

  protected constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends DomainError {
  readonly name = "ValidationError";
  constructor(message: string) {
    super(message);
  }
}

export class InvalidStateTransitionError extends DomainError {
  readonly name = "InvalidStateTransitionError";
  constructor(message: string) {
    super(message);
  }
}
