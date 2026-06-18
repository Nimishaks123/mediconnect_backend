import { IAutoCompleteAppointmentsUseCase } from "@application/interfaces/appointment/IAutoCompleteAppointmentsUseCase";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";

export class AutoCompleteAppointmentsUseCase
  implements IAutoCompleteAppointmentsUseCase
{
  constructor(
    private readonly appointmentRepo: IAppointmentRepository
  ) {}

  async execute(): Promise<void> {
    const appointments =
      await this.appointmentRepo.findAppointmentsForCompletion();

    for (const appointment of appointments) {
      if (appointment.isPast()) {
        appointment.complete();

        await this.appointmentRepo.updateStatus(
          appointment.getId(),
          appointment.getStatus()
        );
      }
    }
  }
}