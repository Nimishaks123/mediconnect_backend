import { User } from "@domain/entities/User";
import { Patient } from "@domain/entities/Patient";

export interface GetPatientProfileResponseDTO {
  user: User;
  patient: Patient;
}
