import { Prescription } from "../entities/Prescription";

export interface IPrescriptionRepository {
  save(prescription: Prescription): Promise<void>;

  findById(
    prescriptionId: string
  ): Promise<Prescription | null>;

  findByAppointmentId(
    appointmentId: string
  ): Promise<Prescription | null>;
  
}