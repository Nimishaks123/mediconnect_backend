import { IDoctorScheduleRepository } from "../../domain/interfaces/IDoctorScheduleRepository";
import { DoctorSchedule } from "../../domain/entities/DoctorSchedule";
import { DoctorScheduleModel } from "../persistence/models/DoctorScheduleModel";
// import { RRule } from "rrule";

export class DoctorScheduleRepository implements IDoctorScheduleRepository {

  async save(schedule: DoctorSchedule): Promise<DoctorSchedule> {
  let doc;

  if (schedule.getId()) {
    doc = await DoctorScheduleModel.findByIdAndUpdate(
      schedule.getId(),
      {
        doctorId: schedule.getDoctorId(),
        rrule: schedule.getRRule(),
        timeWindows: schedule.getTimeWindows(),
        slotDuration: schedule.getSlotDuration(),
        validFrom: schedule.getValidFrom(),
        validTo: schedule.getValidTo(),
        timezone: schedule.getTimezone(),
          cancelledSlots: schedule.getCancelledSlots(),
      },
      { new: true }
    );
  } else {
    doc = new DoctorScheduleModel({
      doctorId: schedule.getDoctorId(),
      rrule: schedule.getRRule(),
      timeWindows: schedule.getTimeWindows(),
      slotDuration: schedule.getSlotDuration(),
      validFrom: schedule.getValidFrom(),
      validTo: schedule.getValidTo(),
      timezone: schedule.getTimezone(),
        cancelledSlots: schedule.getCancelledSlots(),
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

  async findByDoctorId(doctorId: string): Promise<DoctorSchedule | null> {
  const doc = await DoctorScheduleModel.findOne({ doctorId });

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
}