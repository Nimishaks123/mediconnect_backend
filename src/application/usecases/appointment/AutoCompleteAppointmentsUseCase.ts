import { IAutoCompleteAppointmentsUseCase } from "@application/interfaces/appointment/IAutoCompleteAppointmentsUseCase";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { ICreditDoctorEarningsUseCase } from "@application/interfaces/wallet/ICreditDoctorEarningsUseCase";
export class AutoCompleteAppointmentsUseCase
  implements IAutoCompleteAppointmentsUseCase
{
  constructor(
    private readonly appointmentRepo: IAppointmentRepository,
     private readonly creditDoctorEarningsUseCase:
      ICreditDoctorEarningsUseCase
  ) {}

  async execute(): Promise<void> {
    const appointments =
      await this.appointmentRepo.findAppointmentsForCompletion();

    for (const appointment of appointments) {
      if (!appointment.isPast()) {
        continue;
      }
        appointment.complete();
        

        await this.appointmentRepo.updateStatus(
          appointment.getId(),
          appointment.getStatus()
        );
        await this.creditDoctorEarningsUseCase.execute({

        doctorId:
          appointment.getDoctorId(),

        appointmentId:
          appointment.getBookingId(),

        appointmentAmount:
          appointment.getPrice(),
      });
      }
    }
  }
