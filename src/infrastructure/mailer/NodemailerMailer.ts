import nodemailer from "nodemailer";
import { IMailer } from "../../domain/interfaces/IMailer";
import { INotificationService } from "@domain/interfaces/INotificationService";
import { AppError } from "../../common/AppError";
import { StatusCode } from "../../common/enums";

export class NodemailerMailer implements IMailer, INotificationService {
  private _transporter: nodemailer.Transporter;

  constructor(
    private readonly host: string,
    private readonly port: number,
    private readonly user: string,
    private readonly pass: string,
    private readonly from: string
  ) {
    this._transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.port === 465,
      auth: {
        user: this.user,
        pass: this.pass,
      },
    });
  }

  async sendOtp(email: string, code: string): Promise<void> {
    try {
      const html = `
        <p>Your MediConnect OTP is: <strong>${code}</strong></p>
        <p>This OTP expires soon.</p>
      `;

      await this._transporter.sendMail({
        from: this.from,
        to: email,
        subject: "MediConnect OTP Verification",
        html,
      });
    } catch (err) {
      throw new AppError("Failed to send OTP email", StatusCode.INTERNAL_ERROR);
    }
  }

  async sendDoctorApproved(email: string): Promise<void> {
    try {
      await this._transporter.sendMail({
        from: this.from,
        to: email,
        subject: "MediConnect Doctor Approved",
        html: `<h3>Approval Successful</h3>
        <p>Your documents have been verified</p>
        <p>You can now log in to <b>MediConnect</b>.</p>`,
      });
    } catch (err) {
      throw new AppError("Failed to send approval notification", StatusCode.INTERNAL_ERROR);
    }
  }

  async sendDoctorRejected(email: string, reason: string): Promise<void> {
    try {
      await this._transporter.sendMail({
        from: this.from,
        to: email,
        subject: "MediConnect Verification Rejected",
        html: `<h3>Verification Rejected</h3>
        <p><b>Reason:</b> ${reason}</p>`,
      });
    } catch (err) {
      throw new AppError("Failed to send rejection notification", StatusCode.INTERNAL_ERROR);
    }
  }
}
