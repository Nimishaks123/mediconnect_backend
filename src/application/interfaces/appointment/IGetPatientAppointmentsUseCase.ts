import { PatientAppointmentDTO } from "@application/dtos/appointment/PatientAppointmentDTO";
export interface IGetPatientAppointmentUseCase{
    execute(patientId: string): Promise<PatientAppointmentDTO[]>;
}