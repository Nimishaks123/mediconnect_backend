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
    private readonly email: string,
    private readonly code: string,
    private readonly expiresAt: Date,
    private readonly createdAt: Date,
    private attempts: number,
    private readonly id?: string,
    private readonly context: OtpContext = OtpContext.SIGNUP,
    private verified: boolean = false
  ) {}
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
//new otp creation
  static create(
    email: string,
    code: string,
    expiresAt: Date,
    context: OtpContext = OtpContext.SIGNUP
  ): Otp {
    return new Otp(email, code, expiresAt, new Date(), 0, undefined, context, false);
  }
  getId(): string | undefined {
  return this.id;
}

getEmail(): string {
  return this.email;
}

getCode(): string {
  return this.code;
}

getExpiresAt(): Date {
  return this.expiresAt;
}

getCreatedAt(): Date {
  return this.createdAt;
}

getAttempts(): number {
  return this.attempts;
}

getContext(): OtpContext {
  return this.context;
}

isVerified(): boolean {
  return this.verified;
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
