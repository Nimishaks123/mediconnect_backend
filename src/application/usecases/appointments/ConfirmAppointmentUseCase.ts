// application/usecases/appointments/ConfirmAppointmentUseCase.ts
import { ConfirmAppointmentDTO } from "@application/dtos/appointments/ConfirmAppointmentDTO";
import { IConfirmAppointmentUseCase } from "@application/interfaces/appointments/IConfirmAppointmentUseCase";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { InvalidAppointmentStateError } from "@domain/errors/InvalidAppointmentStateError";
import { DomainError } from "@domain/errors/DomainError";
import { AppError } from "@common/AppError";

export class ConfirmAppointmentUseCase
  implements IConfirmAppointmentUseCase
{
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(input: ConfirmAppointmentDTO): Promise<void> {
    const { appointmentId, doctorId } = input;

    // 1️⃣ Fetch appointment
    const appointment =
      await this.appointmentRepo.findById(appointmentId);

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    // 2️⃣ Authorization: only owning doctor can confirm
    if (appointment.getDoctorId() !== doctorId) {
      throw new AppError(
        "You are not authorized to confirm this appointment",
        403
      );
    }

    // 3️⃣ Domain rule: confirm appointment
    try {
      appointment.confirm();
    } catch (error) {
      if (error instanceof InvalidAppointmentStateError) {
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
