import { IDoctorScheduleRepository } from "../../domain/interfaces/IDoctorScheduleRepository";
import { DoctorSchedule } from "../../domain/entities/DoctorSchedule";
import { DoctorScheduleModel } from "../persistence/models/DoctorScheduleModel";
import { RRule } from "rrule";

export class DoctorScheduleRepository implements IDoctorScheduleRepository {

  async save(schedule: DoctorSchedule): Promise<DoctorSchedule> {
    let doc;
    
    if (schedule.id) {
      doc = await DoctorScheduleModel.findByIdAndUpdate(
        schedule.id,
        {
          doctorId: schedule.doctorId,
          rrule: schedule.rrule,
          timeWindows: schedule.timeWindows,
          slotDuration: schedule.slotDuration,
          validFrom: schedule.validFrom,
          validTo: schedule.validTo,
          timezone: schedule.timezone,
        },
        { new: true }
      );
    } else {
      doc = new DoctorScheduleModel({
        doctorId: schedule.doctorId,
        rrule: schedule.rrule,
        timeWindows: schedule.timeWindows,
        slotDuration: schedule.slotDuration,
        validFrom: schedule.validFrom,
        validTo: schedule.validTo,
        timezone: schedule.timezone,
      });
      await doc.save();
    }

    if (!doc) {
      throw new Error("Failed to save doctor schedule");
    }

    return new DoctorSchedule(
      doc._id.toString(),
      doc.doctorId,
      doc.rrule,
      doc.timeWindows,
      doc.slotDuration,
      doc.validFrom,
      doc.validTo,
      doc.timezone,
      doc.cancelledSlots
    );
  }

  async findById(id: string): Promise<DoctorSchedule | null> {
    const doc = await DoctorScheduleModel.findById(id);
    if (!doc) return null;

    return new DoctorSchedule(
      doc._id.toString(),
      doc.doctorId,
      doc.rrule,
      doc.timeWindows,
      doc.slotDuration,
      doc.validFrom,
      doc.validTo,
      doc.timezone,
      doc.cancelledSlots
    );
  }

  async findByDoctorId(doctorId: string): Promise<DoctorSchedule[]> {
    const docs = await DoctorScheduleModel.find({ doctorId });

    return docs.map(
      (doc) =>
        new DoctorSchedule(
          doc._id.toString(),
          doc.doctorId,
          doc.rrule,
          doc.timeWindows,
          doc.slotDuration,
          doc.validFrom,
          doc.validTo,
          doc.timezone,
          doc.cancelledSlots
        )
    );
  }

  async deleteById(id: string): Promise<void> {
    await DoctorScheduleModel.findByIdAndDelete(id);
  }

  async deleteSlotById(compositeId: string): Promise<void> {
    const [scheduleId, slotReference] = compositeId.split("|");
    if (!scheduleId || !slotReference) return;
    await DoctorScheduleModel.findByIdAndUpdate(scheduleId, {
      $addToSet: { cancelledSlots: slotReference }
    });
  }

  async generateSlots(
    doctorId: string,
    from: string,
    to: string
  ): Promise<
    {
      date: string;
      startTime: string;
      endTime: string;
    }[]
  > {

    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Only schedules active in the requested range
    const schedules = await DoctorScheduleModel.find({
      doctorId,
      validFrom: { $lte: toDate },
      validTo: { $gte: fromDate },
    });

    if (!schedules.length) return [];

    const allSlots: {
      date: string;
      startTime: string;
      endTime: string;
    }[] = [];

    for (const schedule of schedules) {

      // 🔑 IMPORTANT: attach dtstart to RRULE
      const rule = new RRule({
        ...RRule.parseString(schedule.rrule),
        dtstart: new Date(schedule.validFrom),
      });

      const dates = rule.between(fromDate, toDate, true);

      for (const date of dates) {

        const dateStr = date.toISOString().split("T")[0];

        for (const window of schedule.timeWindows) {

          const [startHour, startMin] = window.start.split(":").map(Number);
          const [endHour, endMin] = window.end.split(":").map(Number);

          let current = new Date(date);
          current.setHours(startHour, startMin, 0, 0);

          const windowEnd = new Date(date);
          windowEnd.setHours(endHour, endMin, 0, 0);

          while (current < windowEnd) {

            const slotStart = new Date(current);

            const slotEnd = new Date(current);
            slotEnd.setMinutes(
              slotEnd.getMinutes() + schedule.slotDuration
            );

            if (slotEnd > windowEnd) break;

            allSlots.push({
              date: dateStr,
              startTime: slotStart.toTimeString().slice(0, 5),
              endTime: slotEnd.toTimeString().slice(0, 5),
            });

            current = slotEnd;
          }
        }
      }
    }

    return allSlots;
  }
}