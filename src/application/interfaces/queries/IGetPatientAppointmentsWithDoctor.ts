import { PatientAppointmentDTO } from "../../dtos/appointment/PatientAppointmentDTO";

export interface IGetPatientAppointmentsWithDoctor {
  execute(patientId: string): Promise<PatientAppointmentDTO[]>;
}
