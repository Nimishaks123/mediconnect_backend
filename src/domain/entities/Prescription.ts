export interface Medicine {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export class Prescription {
  constructor(
    private readonly prescriptionId: string,
    private readonly appointmentId: string,
    private readonly doctorId: string,
    private readonly patientId: string,
    private readonly diagnosis: string,
    private readonly medicines: Medicine[],
    private readonly notes?: string,
    private readonly createdAt?: Date
  ) {}

  getId() {
    return this.prescriptionId;
  }

  getAppointmentId() {
    return this.appointmentId;
  }

  getDoctorId() {
    return this.doctorId;
  }

  getPatientId() {
    return this.patientId;
  }

  getDiagnosis() {
    return this.diagnosis;
  }

  getMedicines() {
    return this.medicines;
  }

  getNotes() {
    return this.notes;
  }

  getCreatedAt() {
    return this.createdAt;
  }
}