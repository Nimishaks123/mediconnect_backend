import { IAppointmentQueryRepository } from "@application/interfaces/queries/IAppointmentQueryRepository";
import { PatientAppointmentDTO } from "@application/dtos/appointment/PatientAppointmentDTO";
import { IAutoCompleteAppointmentsUseCase } from "@application/interfaces/appointment/IAutoCompleteAppointmentsUseCase";
export class GetPatientAppointmentUseCase {
  constructor(
    private readonly queryRepo: IAppointmentQueryRepository,
     private readonly autoCompleteAppointmentsUC:
    IAutoCompleteAppointmentsUseCase
  ) {}

  async execute(patientId: string): Promise<PatientAppointmentDTO[]> {
     await this.autoCompleteAppointmentsUC.execute();

    return this.queryRepo.findByPatientId(patientId);
  }
}