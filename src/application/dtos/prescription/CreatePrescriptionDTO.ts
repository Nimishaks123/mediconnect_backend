export interface MedicineDTO {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface CreatePrescriptionDTO {
  appointmentId: string;
  doctorId: string;

  diagnosis: string;

  medicines: MedicineDTO[];

  notes?: string;
}