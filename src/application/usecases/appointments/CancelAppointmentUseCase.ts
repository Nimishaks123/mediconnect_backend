// application/usecases/appointments/CancelAppointmentUseCase.ts
import { CancelAppointmentDTO } from "@application/dtos/appointments/CancelAppointmentDTO";
import { ICancelAppointmentUseCase } from "@application/interfaces/appointments/ICancelAppointmentUseCase";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { InvalidAppointmentStateError } from "@domain/errors/InvalidAppointmentStateError";
import { AppointmentAlreadyFinalizedError } from "@domain/errors/AppointmentAlreadyFinalizedError";
import { DomainError } from "@domain/errors/DomainError";
import { AppError } from "@common/AppError";

export class CancelAppointmentUseCase
  implements ICancelAppointmentUseCase
{
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(input: CancelAppointmentDTO): Promise<void> {
    const { appointmentId, actorId } = input;

    // 1️⃣ Fetch appointment
    const appointment =
      await this.appointmentRepo.findById(appointmentId);

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    // 2️⃣ Authorization: doctor OR patient
    const isDoctor =
      appointment.getDoctorId() === actorId;
    const isPatient =
      appointment.getPatientId() === actorId;

    if (!isDoctor && !isPatient) {
      throw new AppError(
        "You are not authorized to cancel this appointment",
        403
      );
    }

    // 3️⃣ Domain rule: cancel appointment
    try {
      appointment.cancel();
    } catch (error) {
      if (
        error instanceof InvalidAppointmentStateError ||
        error instanceof AppointmentAlreadyFinalizedError
      ) {
        throw new AppError(error.message, 400);
      }

      if (error instanceof DomainError) {
        throw new AppError(error.message, 400);
      }

      throw error;
    }

    // 4️⃣ Persist state change
    await this.appointmentRepo.save(appointment);
  }
}
