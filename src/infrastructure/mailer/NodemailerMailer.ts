import nodemailer from "nodemailer";
import { IMailer } from "../../domain/interfaces/IMailer";
import { INotificationService } from "@domain/interfaces/INotificationService";

export class NodemailerMailer implements IMailer,INotificationService {
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
  }
  async sendDoctorApproved(email: string): Promise<void> {
    await this._transporter.sendMail({
      from:this.from,
      to:email,
      subject:"MediConnect Doctor Approved",
      html:
      `<h3>Approval Successful</h3>
      <p>Your documents have been verified</p>
      <p>You can now log in to <b>MediConnect</b>.</p>
      `,
    })
  }
  async sendDoctorRejected(email: string, reason: string): Promise<void> {
    await this._transporter.sendMail({
      from:this.from,
      to:email,
      subject:"MediConnect Verfication Rejected",
      html:
      `<h3>Verification Rejected</h3>
      <p><b>Reason:</b>${reason}</p>`,
      
    })
  }
}
