import { IDoctorScheduleRepository } 
  from "../../../domain/interfaces/IDoctorScheduleRepository";
import { RRulePolicy } from "../../../domain/policies/RRulePolicy";
import { DoctorSchedule } from "../../../domain/entities/DoctorSchedule";
import { DoctorSlotDTO } from "../../dtos/doctorSchedule/DoctorSlotDTO";

export class GenerateDoctorSlotsUseCase {
  constructor(
    private readonly scheduleRepository: IDoctorScheduleRepository,
    private readonly rrulePolicy: RRulePolicy
  ) {}

  async execute(
    doctorId: string,
    from: Date,
    to: Date
  ): Promise<DoctorSlotDTO[]> {

    // Normalize query range
    const queryFrom = new Date(from);
    queryFrom.setHours(0, 0, 0, 0);

    const queryTo = new Date(to);
    queryTo.setHours(23, 59, 59, 999);

    const schedules =
      await this.scheduleRepository.findByDoctorId(doctorId);

    if (schedules.length === 0) return [];

    const slots: DoctorSlotDTO[] = [];

    for (const schedule of schedules) {
      //  Normalize schedule range
      const scheduleFrom = new Date(schedule.validFrom);
      scheduleFrom.setHours(0, 0, 0, 0);

      const scheduleTo = new Date(schedule.validTo);
      scheduleTo.setHours(23, 59, 59, 999);

      //  Effective range
      const effectiveFrom =
        queryFrom > scheduleFrom ? queryFrom : scheduleFrom;

      const effectiveTo =
        queryTo < scheduleTo ? queryTo : scheduleTo;

      if (effectiveFrom > effectiveTo) continue;

      const workingDates = this.rrulePolicy.generateDates(
        schedule.rrule,
        effectiveFrom,
        effectiveTo
      );

      for (const date of workingDates) {
        slots.push(
          ...this.generateSlotsForDate(schedule, date)
        );
      }
    }

    // Deduplicate
    return slots.filter(
      (slot, index, self) =>
        index ===
        self.findIndex(
          (s) =>
            s.date === slot.date &&
            s.startTime === slot.startTime
        )
    );
  }

  // Generate slots for one day
  
  private generateSlotsForDate(
    schedule: DoctorSchedule,
    date: Date
  ): DoctorSlotDTO[] {
    const slots: DoctorSlotDTO[] = [];

    for (const window of schedule.timeWindows) {
      const [sh, sm] = window.start.split(":").map(Number);
      const [eh, em] = window.end.split(":").map(Number);

      // date creation 
      let current = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        sh,
        sm,
        0,
        0
      );

      const end = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        eh,
        em,
        0,
        0
      );

      while (
        current.getTime() + schedule.slotDuration * 60000 <=
        end.getTime()
      ) {
        const slotStart = new Date(current);
        const slotEnd = new Date(
          current.getTime() + schedule.slotDuration * 60000
        );

        slots.push({
          date: slotStart.toISOString().split("T")[0],
          startTime: slotStart.toTimeString().slice(0, 5),
          endTime: slotEnd.toTimeString().slice(0, 5),
        });

        current = slotEnd;
      }
    }

    return slots;
  }
}
