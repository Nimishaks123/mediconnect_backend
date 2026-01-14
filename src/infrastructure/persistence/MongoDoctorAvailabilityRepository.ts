import { IDoctorAvailabilityRepository } from "@domain/interfaces/IDoctorAvailabilityRepository";
import { DoctorAvailability } from "@domain/entities/DoctorAvailability";
import {
  DoctorAvailabilityModel,
  DoctorAvailabilityDB,
} from "./models/DoctorAvailabilityModel";

export class MongoDoctorAvailabilityRepository
  implements IDoctorAvailabilityRepository
{
  async findById(
    id: string
  ): Promise<DoctorAvailability | null> {
    const doc = await DoctorAvailabilityModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findAvailableSlots(
    doctorId: string,
    date: string
  ): Promise<DoctorAvailability[]> {
    const docs = await DoctorAvailabilityModel.find({
      doctorId,
      date,
      isBooked: false,
    });

    return docs.map(this.toDomain);
  }

  async createMany(
    slots: DoctorAvailability[]
  ): Promise<void> {
    const docs = slots.map(this.toPersistence);
    await DoctorAvailabilityModel.insertMany(docs);
  }

  async save(slot: DoctorAvailability): Promise<void> {
    await DoctorAvailabilityModel.findByIdAndUpdate(
      slot.getId(),
      this.toPersistence(slot)
    );
  }

private toDomain(
    doc: DoctorAvailabilityDB
  ): DoctorAvailability {
    return new DoctorAvailability(
      doc._id.toString(),
      doc.doctorId,
      doc.date,
      doc.startTime,
      doc.endTime,
      doc.isBooked
    );
  }

  private toPersistence(
    entity: DoctorAvailability
  ) {
    return {
      doctorId: entity.getDoctorId(),
      date: entity.getDate(),
      startTime: entity.getStartTime(),
      endTime: entity.getEndTime(),
      isBooked: entity.isSlotBooked(),
    };
  }
  async reserveSlot(
  slotId: string
): Promise<DoctorAvailability | null> {
  const doc = await DoctorAvailabilityModel.findOneAndUpdate(
    {
      _id: slotId,
      isBooked: false, //  condition
    },
    {
      $set: { isBooked: true },
    },
    {
      new: true, // return updated doc
    }
  );

  return doc ? this.toDomain(doc) : null;
}

}
