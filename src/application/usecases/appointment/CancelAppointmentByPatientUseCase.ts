import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { IEventBus } from "@application/interfaces/IEventBus";
import { PatientCancelledAppointmentEvent } from "@domain/events/PatientCancelledAppointmentEvent";
import dayjs from "dayjs";
import { ICreateNotificationUseCase } from "@application/interfaces/notification/ICreateNotificationUseCase";
import { NotificationType } from "@domain/enums/NotificationType";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IUserRepository } from "@domain/interfaces/IUserRepository";
import { ICancelAppointmentByPatientUseCase } from "@application/interfaces/appointment/ICancelAppointmentByPatientUseCase";

export class CancelAppointmentByPatientUseCase implements ICancelAppointmentByPatientUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly eventBus: IEventBus,
    private readonly createNotificationUseCase: ICreateNotificationUseCase,
    private readonly doctorRepo: IDoctorRepository,
    private readonly userRepo: IUserRepository
  ) {}

  async execute(dto: { appointmentId: string; patientId: string }): Promise<{ refundAmount: number }> {
    const appointment = await this.appointmentRepo.findById(dto.appointmentId);

    if (!appointment) {
      throw new AppError("Appointment not found", StatusCode.NOT_FOUND);
    }

    if (appointment.getPatientId() !== dto.patientId) {
      throw new AppError("Not authorized to cancel this appointment", StatusCode.FORBIDDEN);
    }

    if (appointment.getStatus() !== AppointmentStatus.CONFIRMED && appointment.getStatus() !== AppointmentStatus.RESCHEDULED) {
       throw new AppError(`Cannot cancel appointment with status ${appointment.getStatus()}`, StatusCode.BAD_REQUEST);
    }

    const doctor = await this.doctorRepo.findById(appointment.getDoctorId());
    const user = await this.userRepo.findById(dto.patientId);
    
    const doctorUser = doctor ? await this.userRepo.findById(doctor.getUserId()) : null;
    const doctorName = doctorUser ? doctorUser.name : "your doctor";
    const patientName = user ? user.name : "the patient";

    // CALCULATE REFUND
    const { refundAmount, cancellationCharge } = this.calculateRefund(appointment.getDate(), appointment.getStartTime(), appointment.getPrice());

    // Update appointment domain model
    appointment.cancel(cancellationCharge, refundAmount);
    await this.appointmentRepo.save(appointment);

    // Emit event for side effects (Wallet refund and notification emails)
    await this.eventBus.publish(
      new PatientCancelledAppointmentEvent(
        appointment.getId(),
        appointment.getPatientId(),
        appointment.getDoctorId(),
        appointment.getDate(),
        appointment.getStartTime(),
        appointment.getEndTime(),
        appointment.getStatus(),
        refundAmount,
        cancellationCharge
      )
    );

    // NOTIFY DOCTOR
    await this.createNotificationUseCase.execute({
      userId: doctor?.getUserId() || appointment.getDoctorId(),
      title: "Appointment Cancelled",
      message: `Your appointment with ${patientName} on ${appointment.getDate()} at ${appointment.getStartTime()} has been cancelled`,
      type: NotificationType.APPOINTMENT_CANCELLED
    });

    // NOTIFY PATIENT
    await this.createNotificationUseCase.execute({
      userId: dto.patientId,
      title: "Appointment Cancelled",
      message: `You have cancelled your appointment with Dr. ${doctorName}`,
      type: NotificationType.APPOINTMENT_CANCELLED
    });

    return { refundAmount };
  }

  private calculateRefund(dateStr: string, timeStr: string, price: number): { refundAmount: number; cancellationCharge: number } {
    const formattedTime = timeStr.includes(":") && timeStr.split(":").length === 2 ? `${timeStr}:00` : timeStr;
    const appointmentDateTime = dayjs(`${dateStr}T${formattedTime}`);
    const now = dayjs();
    const diffInHours = appointmentDateTime.diff(now, 'hour', true);

    let refundAmount = 0;
    let cancellationCharge = price;

    if (diffInHours > 24) {
      refundAmount = price;
      cancellationCharge = 0;
    } else if (diffInHours > 1) {
      refundAmount = price * 0.8;
      cancellationCharge = price * 0.2;
    } else {
      refundAmount = 0;
      cancellationCharge = price;
    }

    return { refundAmount, cancellationCharge };
  }
}

