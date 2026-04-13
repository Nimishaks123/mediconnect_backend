import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { IEventBus } from "@application/interfaces/IEventBus";
import { PatientCancelledAppointmentEvent } from "@domain/events/PatientCancelledAppointmentEvent";
import dayjs from "dayjs";

export class CancelAppointmentByPatientUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly eventBus: IEventBus
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

