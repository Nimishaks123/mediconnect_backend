import { IAppointmentQueryRepository } from "@application/interfaces/queries/IAppointmentQueryRepository";
import { PatientAppointmentDTO } from "@application/dtos/appointment/PatientAppointmentDTO";

export class GetPatientAppointmentUseCase {
  constructor(
    private readonly queryRepo: IAppointmentQueryRepository
  ) {}

  async execute(patientId: string): Promise<PatientAppointmentDTO[]> {
    return this.queryRepo.findByPatientId(patientId);
  }
}