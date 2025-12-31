

export interface IMailer {
    sendOtp(email: string, code: string): Promise<void>;
  }
  