export class AppointmentRescheduledEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly patientId: string,
    public readonly doctorId: string,
    public readonly date: string,
    public readonly startTime: string,
    public readonly endTime: string
  ) {}
}
