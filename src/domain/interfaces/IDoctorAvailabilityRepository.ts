// domain/interfaces/IDoctorAvailabilityRepository.ts
import { DoctorAvailability } from "../entities/DoctorAvailability";

export interface IDoctorAvailabilityRepository {
  findById(id: string): Promise<DoctorAvailability | null>;
  save(slot: DoctorAvailability): Promise<void>;
  findAvailableSlots(
    doctorId: string,
    date: string
  ): Promise<DoctorAvailability[]>;
  createMany(slots: DoctorAvailability[]): Promise<void>;
  reserveSlot(slotId: string): Promise<DoctorAvailability | null>;
}
