import { IDoctorScheduleRepository } from "../../domain/interfaces/IDoctorScheduleRepository";
import { DoctorSchedule } from "../../domain/entities/DoctorSchedule";
import { DoctorScheduleModel } from "../../infrastructure/persistence/models/DoctorScheduleModel";

export class DoctorScheduleRepository
  implements IDoctorScheduleRepository
{
  async findByDoctorId(doctorId: string): Promise<DoctorSchedule | null> {
    const doc = await DoctorScheduleModel.findOne({ doctorId }).lean();

    if (!doc) return null;

    return new DoctorSchedule(
      doc._id.toString(),
      doc.doctorId,
      doc.rrule,
      doc.dailyStartTime,
      doc.dailyEndTime,
      doc.slotDurationMinutes,
      doc.timezone
    );
  }

  async save(schedule: DoctorSchedule): Promise<DoctorSchedule> {
    const created = await DoctorScheduleModel.create({
      doctorId: schedule.getDoctorId(),
      rrule: schedule.getRRule(),
      dailyStartTime: schedule.getDailyTimeWindow().start,
      dailyEndTime: schedule.getDailyTimeWindow().end,
      slotDurationMinutes: schedule.getSlotDuration(),
      timezone: schedule.getTimezone(),
    });

    return new DoctorSchedule(
      created._id.toString(),
      created.doctorId,
      created.rrule,
      created.dailyStartTime,
      created.dailyEndTime,
      created.slotDurationMinutes,
      created.timezone
    );
  }
}
