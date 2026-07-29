import { Medicine } from "@domain/entities/Prescription";

export interface PrescriptionDetailsDTO {
  prescriptionId: string;
  bookingId?: string;
  appointmentId: string;

  patientName?: string;
  patientId?: string;
  consultationDate?: string;
  consultationTime?: string;
  consultationMode?: string;

  diagnosis: string;

  medicines: Medicine[];

  notes?: string;

  createdAt?: Date;

  doctor: {
    name: string;
    specialty: string;
    registrationNumber: string;
  };
}