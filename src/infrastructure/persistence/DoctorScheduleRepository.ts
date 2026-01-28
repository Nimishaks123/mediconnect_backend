import { IDoctorScheduleRepository } from "../../domain/interfaces/IDoctorScheduleRepository";
import { DoctorSchedule } from "../../domain/entities/DoctorSchedule";
import { DoctorScheduleModel } from "../persistence/models/DoctorScheduleModel";

export class DoctorScheduleRepository
  implements IDoctorScheduleRepository
{
  async save(schedule: DoctorSchedule): Promise<DoctorSchedule> {
    const doc = await DoctorScheduleModel.findOneAndUpdate(
      { doctorId: schedule.doctorId }, // 🔑 one schedule per doctor
      {
        doctorId: schedule.doctorId,
        rrule: schedule.rrule,
        timeWindows: schedule.timeWindows,
        slotDuration: schedule.slotDuration,
        validFrom: schedule.validFrom,
        validTo: schedule.validTo,
        timezone: schedule.timezone,
      },
      {
        upsert: true,
        new: true,
      }
    );

    if (!doc) {
      throw new Error("Failed to save doctor schedule");
    }

    return new DoctorSchedule(
      doc.id,
      doc.doctorId,
      doc.rrule,
      doc.timeWindows,        // ✅ FIX
      doc.slotDuration,
      doc.validFrom,
      doc.validTo,
      doc.timezone
    );
  }

  async findByDoctorId(
    doctorId: string
  ): Promise<DoctorSchedule[]> {
    const docs = await DoctorScheduleModel.find({ doctorId });

    return docs.map(
      (doc) =>
        new DoctorSchedule(
          doc.id,
          doc.doctorId,
          doc.rrule,
          doc.timeWindows,    // ✅ FIX
          doc.slotDuration,
          doc.validFrom,
          doc.validTo,
          doc.timezone
        )
    );
  }
}
