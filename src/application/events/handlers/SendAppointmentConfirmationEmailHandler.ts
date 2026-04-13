import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IEmailService } from "@application/interfaces/IEmailService";
import { AppointmentConfirmedEvent } from "@domain/events/AppointmentConfirmedEvent";

export class SendAppointmentConfirmationEmailHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly emailService: IEmailService
  ) {}

  async handle(event: AppointmentConfirmedEvent): Promise<void> {
    try {
      const patient = await this.userRepository.findById(event.patientId);
      const doctorProfile = await this.doctorRepository.findById(event.doctorId);

      if (patient && doctorProfile) {
        const doctorUser = await this.userRepository.findById(doctorProfile.getUserId());

        if (patient.email && patient.name && doctorUser?.name) {
          await this.emailService.sendAppointmentConfirmedEmail({
            patientEmail: patient.email,
            patientName: patient.name,
            doctorName: doctorUser.name,
            date: event.date,
            startTime: event.startTime,
            endTime: event.endTime,
            status: "CONFIRMED"
          });
        }
      }
    } catch (error) {
      console.error("Failed to send confirmation email in event handler:", error);
    }
  }
}
