
function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const date = new Date(1970, 0, 1, h, m);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toTimeString().slice(0, 5);
}

function isBefore(t1: string, t2: string): boolean {
  return t1 < t2;
}


import { DoctorSchedule } from "../../../domain/entities/DoctorSchedule";
import { DoctorAvailability } from "../../../domain/entities/DoctorAvailability";

export class GenerateDoctorAvailabilityUseCase {
  execute(
    schedule: DoctorSchedule,
    fromDate: Date,
    toDate: Date
  ): DoctorAvailability[] {
    const availabilities: DoctorAvailability[] = [];

    // 1️⃣ Get working dates using rrule
    const workingDates = schedule.getWorkingDates(fromDate, toDate);

    const { start, end } = schedule.getDailyTimeWindow();
    const slotDuration = schedule.getSlotDuration();

    // 2️⃣ Generate slots for each working date
    for (const date of workingDates) {
      const dateStr = date.toISOString().split("T")[0];
      let slotStart = start;

      while (isBefore(slotStart, end)) {
        const slotEnd = addMinutes(slotStart, slotDuration);

        if (slotEnd > end) break;

        availabilities.push(
          new DoctorAvailability(
            null,
            schedule.getDoctorId(),
            dateStr,
            slotStart,
            slotEnd
          )
        );

        slotStart = slotEnd;
      }
    }

    return availabilities;
  }
}
