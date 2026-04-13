import { ICodeVerifier } from "../interfaces/ICodeVerifier";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { OtpCode } from "../value-objects/OtpCode";

export enum OtpContext {
  SIGNUP = "SIGNUP",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}

export class Otp {
  private constructor(
    public readonly email: string,
    public readonly code: string,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public attempts: number,
    public readonly id?: string,
    public readonly context: OtpContext = OtpContext.SIGNUP,
    public verified: boolean = false
  ) {}

  /**
   * ✅ DDD Factory Method for reconstruction
   * Ensures domain invariants are maintained when rehydrating from persistence.
   */
  static rehydrate(data: {
    email: string;
    code: string;
    expiresAt: Date;
    createdAt: Date;
    attempts: number;
    id: string;
    context: string;
    verified: boolean;
  }): Otp {
    return new Otp(
      data.email,
      data.code,
      data.expiresAt,
      data.createdAt,
      data.attempts,
      data.id,
      data.context as OtpContext,
      data.verified
    );
  }

  /**
   * ✅ Domain Factory for new OTP creation
   */
  static create(
    email: string,
    code: string,
    expiresAt: Date,
    context: OtpContext = OtpContext.SIGNUP
  ): Otp {
    return new Otp(email, code, expiresAt, new Date(), 0, undefined, context, false);
  }

  public isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  private incrementAttempts() {
    this.attempts += 1;
  }

  public async verify(providedCode: OtpCode, verifier: ICodeVerifier): Promise<void> {
    if (this.isExpired()) {
      throw new AppError(MESSAGES.OTP_EXPIRED, StatusCode.BAD_REQUEST);
    }

    if (this.verified) {
      throw new AppError(MESSAGES.OTP_ALREADY_VERIFIED ?? "OTP already verified", StatusCode.BAD_REQUEST);
    }

    const isMatch = await verifier.matches(providedCode.getValue(), this.code);

    if (!isMatch) {
      this.incrementAttempts();
      throw new AppError(MESSAGES.OTP_INVALID, StatusCode.BAD_REQUEST);
    }
  }

  public consume() {
    this.verified = true;
  }
}
