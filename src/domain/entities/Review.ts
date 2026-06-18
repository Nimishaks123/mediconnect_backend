export class Review {
  constructor(
    private readonly id: string,
    private readonly appointmentId: string,
    private readonly doctorId: string,
    private readonly patientId: string,
    private readonly rating: number,
    private readonly comment: string,
    private readonly createdAt?: Date
  ) {}

  getId(): string {
    return this.id;
  }

  getAppointmentId(): string {
    return this.appointmentId;
  }

  getDoctorId(): string {
    return this.doctorId;
  }

  getPatientId(): string {
    return this.patientId;
  }

  getRating(): number {
    return this.rating;
  }

  getComment(): string {
    return this.comment;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }
}