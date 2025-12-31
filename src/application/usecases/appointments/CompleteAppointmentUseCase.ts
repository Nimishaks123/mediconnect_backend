// application/usecases/appointments/CompleteAppointmentUseCase.ts
import { CompleteAppointmentDTO } from "@application/dtos/appointments/CompleteAppointmentDTO";
import { ICompleteAppointmentUseCase } from "@application/interfaces/appointments/ICompleteAppointmentUseCase";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { InvalidAppointmentStateError } from "@domain/errors/InvalidAppointmentStateError";
import { AppointmentAlreadyFinalizedError } from "@domain/errors/AppointmentAlreadyFinalizedError";
import { DomainError } from "@domain/errors/DomainError";
import { AppError } from "@common/AppError";

export class CompleteAppointmentUseCase
  implements ICompleteAppointmentUseCase
{
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(input: CompleteAppointmentDTO): Promise<void> {
    const { appointmentId, doctorId } = input;

    // 1️⃣ Fetch appointment
    const appointment =
      await this.appointmentRepo.findById(appointmentId);

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    // 2️⃣ Authorization: only owning doctor
    if (appointment.getDoctorId() !== doctorId) {
      throw new AppError(
        "You are not authorized to complete this appointment",
        403
      );
    }

    // 3️⃣ Domain rule: complete appointment
    try {
      appointment.complete();
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
