// domain/interfaces/IAppointmentRepository.ts
import { Appointment } from "../entities/Appointment";

export interface IAppointmentRepository {
  // 🔹 Create
  create(appointment: Appointment): Promise<void>;

  // 🔹 Read
  findById(id: string): Promise<Appointment | null>;

  // 🔹 Update
  save(appointment: Appointment): Promise<void>;
}

