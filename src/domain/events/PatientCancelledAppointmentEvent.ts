import { AppointmentStatus } from "@domain/enums/AppointmentStatus";

export class PatientCancelledAppointmentEvent {
  constructor(
    public readonly appointmentId: string,
    public readonly patientId: string,
    public readonly doctorId: string,
    public readonly date: string,
    public readonly startTime: string,
    public readonly endTime: string,
    public readonly status: AppointmentStatus,
    public readonly refundAmount: number,
    public readonly cancellationCharge: number
  ) {}
}
