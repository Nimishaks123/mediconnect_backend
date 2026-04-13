import { IAppointmentQueryRepository } from "../interfaces/queries/IAppointmentQueryRepository";
import { PatientAppointmentDTO } from "../dtos/appointment/PatientAppointmentDTO";

export class GetPatientAppointmentsWithDoctor {
  constructor(
    private readonly queryRepo: IAppointmentQueryRepository
  ) {}

  async execute(patientId: string): Promise<PatientAppointmentDTO[]> {
    return this.queryRepo.findByPatientId(patientId);
  }
}
