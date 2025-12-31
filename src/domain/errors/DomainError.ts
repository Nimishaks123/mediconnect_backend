// domain/errors/DomainError.ts
export abstract class DomainError extends Error {
  abstract readonly name: string;

  protected constructor(message: string) {
    super(message);
  }
}
