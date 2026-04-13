import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { AppointmentStatus } from "@domain/enums/AppointmentStatus";
import { AppError } from "@common/AppError";
import { StatusCode } from "@common/enums";
import { IEventBus } from "@application/interfaces/IEventBus";
import { CancelAppointmentEvent } from "@domain/events/CancelAppointmentEvent";

export class CancelAppointmentUseCase {
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
    private readonly eventBus: IEventBus
  ) {}

  async execute(dto: { appointmentId: string; reason: "EXPIRED" | "FAILED" | "CANCELLED", doctorId?: string }): Promise<void> {
    const appointment = await this.appointmentRepo.findById(dto.appointmentId);

    if (!appointment) {
      throw new AppError("Appointment not found", StatusCode.NOT_FOUND);
    }

    if (dto.doctorId && appointment.getDoctorId() !== dto.doctorId) {
        throw new AppError("Not authorized to cancel this appointment", StatusCode.FORBIDDEN);
    }

    // Doctor can only cancel confirmed appointments
    if (dto.doctorId && appointment.getStatus() !== AppointmentStatus.CONFIRMED && appointment.getStatus() !== AppointmentStatus.RESCHEDULED) {
      throw new AppError(`Cannot cancel an appointment that is currently ${appointment.getStatus()}`, StatusCode.BAD_REQUEST);
    }

    // automated failure/expiry can only happen for pending
    if (!dto.doctorId && appointment.getStatus() !== AppointmentStatus.PAYMENT_PENDING) {
        throw new AppError(` cannot auto-cancel a ${appointment.getStatus()} appointment`, StatusCode.BAD_REQUEST);
    }

    if (dto.reason === "EXPIRED" || dto.reason === "FAILED") {
      appointment.expire();
    } else {
      appointment.cancel();
    }

    await this.appointmentRepo.save(appointment);

    await this.eventBus.publish(
      new CancelAppointmentEvent(
        appointment.getId(),
        appointment.getPatientId(),
        appointment.getDoctorId(),
        appointment.getDate(),
        appointment.getStartTime(),
        appointment.getEndTime(),
        appointment.getStatus(),
        dto.reason
      )
    );
  }
}

