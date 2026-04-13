import { Appointment } from "@domain/entities/Appointment";

export interface IAppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;

  findByDoctorAndSlot(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<Appointment | null>;

  existsOverlappingSlot(
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeAppointmentId?: string
  ): Promise<boolean>;
  findByPatientId(patientId: string): Promise<Appointment[]>
  findAllByDoctorId(doctorId: string): Promise<Appointment[]>;
  findByDoctorAndDateRange(
    doctorId: string,
    from: string,
    to: string
  ): Promise<Appointment[]>;
}
