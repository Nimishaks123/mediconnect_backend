import nodemailer from "nodemailer";
import { IEmailService, AppointmentEmailData } from "../../application/interfaces/IEmailService";
import { config } from "../../common/config";
import logger from "../../common/logger";

export class EmailService implements IEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.mailHost,
      port: config.mailPort,
      secure: config.mailPort === 465, // true for 465, false for other ports
      auth: {
        user: config.mailUser,
        pass: config.mailPass,
      },
    });
  }

  private async sendMail(options: nodemailer.SendMailOptions) {
    try {
      if (!config.mailUser || !config.mailPass) {
        logger.warn("Email service is not configured. Skipping email sending.");
        return;
      }

      await this.transporter.sendMail({
        from: `"${config.mailFrom || 'MediConnect'}" <${config.mailUser}>`,
        ...options,
      });
      logger.info(`Email sent successfully to ${options.to}`);
    } catch (error) {
      logger.error("Failed to send email:", error);
      // We don't throw here to avoid breaking the main business flow
    }
  }

  async sendAppointmentConfirmedEmail(data: AppointmentEmailData): Promise<void> {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2c3e50;">Appointment Confirmed</h2>
        <p>Dear <strong>${data.patientName}</strong>,</p>
        <p>Your appointment with <strong>Dr. ${data.doctorName}</strong> has been successfully confirmed.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #27ae60;">${data.status}</span></p>
        </div>
        <p>Thank you for choosing MediConnect. We look forward to seeing you.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #7f8c8d; text-align: center;">This is an automated message. Please do not reply.</p>
      </div>
    `;

    await this.sendMail({
      to: data.patientEmail,
      subject: `Appointment Confirmed: Dr. ${data.doctorName}`,
      html,
    });
  }

  async sendAppointmentCancelledEmail(data: AppointmentEmailData): Promise<void> {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #c0392b;">Appointment Cancelled</h2>
        <p>Dear <strong>${data.patientName}</strong>,</p>
        <p>We are writing to inform you that your appointment with <strong>Dr. ${data.doctorName}</strong> on <strong>${data.date}</strong> has been cancelled.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${data.date}</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #e74c3c;">CANCELLED</span></p>
        </div>
        <p>If you have any questions, please contact our support team or book a new appointment on our platform.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #7f8c8d; text-align: center;">This is an automated message. Please do not reply.</p>
      </div>
    `;

    await this.sendMail({
      to: data.patientEmail,
      subject: `Appointment Cancelled: Dr. ${data.doctorName}`,
      html,
    });
  }

  async sendAppointmentRescheduledEmail(data: AppointmentEmailData): Promise<void> {
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2980b9;">Appointment Rescheduled</h2>
        <p>Dear <strong>${data.patientName}</strong>,</p>
        <p>Your appointment with <strong>Dr. ${data.doctorName}</strong> has been rescheduled to a new time.</p>
        <div style="background-color: #f1f7ff; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 5px solid #2980b9;">
          <p style="margin: 5px 0;"><strong>New Date:</strong> ${data.date}</p>
          <p style="margin: 5px 0;"><strong>New Time:</strong> ${data.startTime} - ${data.endTime}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #2980b9;">RESCHEDULED</span></p>
        </div>
        <p>We apologize for any inconvenience this may cause.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #7f8c8d; text-align: center;">This is an automated message. Please do not reply.</p>
      </div>
    `;

    await this.sendMail({
      to: data.patientEmail,
      subject: `Appointment Rescheduled: Dr. ${data.doctorName}`,
      html,
    });
  }
}
