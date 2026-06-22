import { Prescription, Medicine } from "@domain/entities/Prescription";
import { IPrescriptionRepository } from "@domain/interfaces/IPrescriptionRepository";
import { PrescriptionModel } from "../persistence/models/PrescriptionModel";

export class PrescriptionRepository
  implements IPrescriptionRepository
{
  private mapMedicines(
    medicines: any[]
  ): Medicine[] {
    return medicines.map((med) => ({
      medicineName: med.medicineName || "",
      dosage: med.dosage || "",
      frequency: med.frequency || "",
      duration: med.duration || "",
      instructions: med.instructions,
    }));
  }

  async save(
    prescription: Prescription
  ): Promise<void> {
    await PrescriptionModel.create({
      prescriptionId:
        prescription.getId(),

      appointmentId:
        prescription.getAppointmentId(),

      doctorId:
        prescription.getDoctorId(),

      patientId:
        prescription.getPatientId(),

      diagnosis:
        prescription.getDiagnosis(),

      medicines:
        prescription.getMedicines(),

      notes:
        prescription.getNotes(),
    });
  }

  async findById(
    prescriptionId: string
  ): Promise<Prescription | null> {
    const doc =
      await PrescriptionModel.findOne({
        prescriptionId,
      });

    if (!doc) return null;

    const medicines =
      this.mapMedicines(
        doc.medicines
      );

    return new Prescription(
      doc.prescriptionId,
      doc.appointmentId,
      doc.doctorId.toString(),
      doc.patientId.toString(),
      doc.diagnosis,
      medicines,
      doc.notes,
      doc.createdAt
    );
  }

  async findByAppointmentId(
    appointmentId: string
  ): Promise<Prescription | null> {
    const doc =
      await PrescriptionModel.findOne({
        appointmentId,
      });

    if (!doc) return null;

    const medicines =
      this.mapMedicines(
        doc.medicines
      );

    return new Prescription(
      doc.prescriptionId,
      doc.appointmentId,
      doc.doctorId.toString(),
      doc.patientId.toString(),
      doc.diagnosis,
      medicines,
      doc.notes,
      doc.createdAt
    );
  }
}