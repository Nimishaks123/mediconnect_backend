import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { Appointment } from "@domain/entities/Appointment";
import {
  AppointmentModel,
  AppointmentDB,
} from "./models/AppointmentModel";

export class MongoAppointmentRepository
  implements IAppointmentRepository
{
  async create(
    appointment: Appointment
  ): Promise<void> {
    await AppointmentModel.create(
      this.toPersistence(appointment)
    );
  }

  async findById(
    id: string
  ): Promise<Appointment | null> {
    const doc = await AppointmentModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async save(
    appointment: Appointment
  ): Promise<void> {
    await AppointmentModel.findByIdAndUpdate(
      appointment.getId(),
      this.toPersistence(appointment)
    );
  }

  /* ---------------- MAPPERS ---------------- */

  private toDomain(doc: AppointmentDB): Appointment {
    return new Appointment(
      doc._id.toString(),
      doc.doctorId,
      doc.patientId,
      doc.availabilityId,
      doc.date,
      doc.startTime,
      doc.endTime,
      doc.status
    );
  }

  private toPersistence(entity: Appointment) {
    return {
      doctorId: entity.getDoctorId(),
      patientId: entity.getPatientId(),
      availabilityId: entity.getAvailabilityId(),
      date: entity.getDate(),
      startTime: entity.getStartTime(),
      endTime: entity.getEndTime(),
      status: entity.getStatus(),
    };
  }
}
