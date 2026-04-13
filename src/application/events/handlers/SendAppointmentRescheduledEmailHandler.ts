import { AppointmentRescheduledEvent } from "@domain/events/AppointmentRescheduledEvent";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IEmailService } from "@application/interfaces/IEmailService";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";

export class SendAppointmentRescheduledEmailHandler {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly emailService: IEmailService
  ) {}

  async handle(event: AppointmentRescheduledEvent): Promise<void> {
    const { patientId, doctorId, date, startTime, endTime } = event;

    const [patient, doctorProfile] = await Promise.all([
      this.userRepository.findById(patientId),
      this.doctorRepository.findById(doctorId)
    ]);

    if (!patient || !doctorProfile) return;

    const doctorUser = await this.userRepository.findById(doctorProfile.getUserId());
    if (!doctorUser || !patient.email || !patient.name || !doctorUser.name) return;

    await this.emailService.sendAppointmentRescheduledEmail({
      patientEmail: patient.email,
      patientName: patient.name,
      doctorName: doctorUser.name,
      date,
      startTime,
      endTime,
      status: AppointmentStatus.RESCHEDULED
    });
  }
}
