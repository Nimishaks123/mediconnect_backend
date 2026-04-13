import { Patient } from "@domain/entities/Patient";

export interface CreatePatientProfileResponseDTO {
  message: string;
  patient: Patient; // Returns raw entity for external mapping
}
