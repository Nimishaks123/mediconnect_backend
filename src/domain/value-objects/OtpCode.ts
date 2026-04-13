import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";

export class OtpCode {
  private readonly value: string;

  constructor(code: unknown) {
    if (typeof code !== "string" && typeof code !== "number") {
      throw new AppError(MESSAGES.OTP_INVALID, StatusCode.BAD_REQUEST);
    }

    const formatted = String(code).trim();

    if (formatted.length !== 6) {
      throw new AppError(MESSAGES.OTP_INVALID, StatusCode.BAD_REQUEST);
    }

    this.value = formatted;
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: string): boolean {
    return this.value === other;
  }
}
