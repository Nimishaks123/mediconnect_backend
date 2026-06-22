import { IDoctorScheduleRepository } from "@domain/interfaces/IDoctorScheduleRepository";
import { IRRulePolicy } from "@domain/policies/IRRulePolicy";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { DateRange } from "@domain/value-objects/DateRange";
import { SlotAvailabilityService } from "@domain/services/SlotAvailabilityService";
import { Slot } from "@domain/entities/Slot";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import { IGenerateDoctorSlotsUseCase } from "../../interfaces/schedule/IGenerateDoctorSlotsUseCase";

export class GenerateDoctorSlotsUseCase implements IGenerateDoctorSlotsUseCase {
  constructor(
    private readonly scheduleRepository: IDoctorScheduleRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly rrulePolicy: IRRulePolicy,
    private readonly availabilityService: SlotAvailabilityService
  ) { }

  async execute(dto: {
    doctorId: string;
    from: string;
    to: string;
  }): Promise<Slot[]> {
    const { doctorId, from, to } = dto;
    const queryRange = DateRange.create(from, to);
    let doctor = await this.doctorRepository.findById(doctorId);
    if (!doctor) {
      doctor = await this.doctorRepository.findByUserId(doctorId);
    }
    
    if (!doctor) {
      console.warn(`[GenerateDoctorSlots] Doctor not found with ID: ${doctorId}`);
      throw new AppError(MESSAGES.DOCTOR_PROFILE_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const doctorProfileId = doctor.getId();

    // const [schedules, appointments] = await Promise.all([
    //   this.scheduleRepository.findByDoctorId(doctorProfileId),
    //   this.appointmentRepository.findByDoctorAndDateRange(
    //     doctorProfileId,
    //     queryRange.from.toISOString().split("T")[0],
    //     queryRange.to.toISOString().split("T")[0]
    //   )
    // ]);
    
    // console.log(`[GenerateDoctorSlots] ID: ${doctorProfileId}, Schedules found: ${schedules.length}`);

    // if (schedules.length === 0) return [];

    // //  Domain Generation: Delegate to aggregate roots
    // const allSlots = schedules.flatMap(schedule => 
    //   schedule.generateSlots(queryRange, this.rrulePolicy)
    // );
    // const uniqueSlots = this.availabilityService.deduplicateSlots(allSlots);
    // return this.availabilityService.filterAvailableSlots(uniqueSlots, appointments);
    const [schedule, appointments] = await Promise.all([
  this.scheduleRepository.findByDoctorId(doctorProfileId),
  this.appointmentRepository.findByDoctorAndDateRange(
    doctorProfileId,
    queryRange.from.toISOString().split("T")[0],
    queryRange.to.toISOString().split("T")[0]
  )
]);

if (!schedule) return [];

//  Domain Generation
const allSlots = schedule.generateSlots(queryRange, this.rrulePolicy);

// const uniqueSlots = this.availabilityService.deduplicateSlots(allSlots);

// return this.availabilityService.filterAvailableSlots(uniqueSlots, appointments);
const tz =
  schedule.getTimezone() || "UTC";

const now =
  dayjs().tz(tz);

const futureSlots =
  allSlots.filter(slot => {

    const slotDateTime =
      dayjs.tz(
        `${slot.getDate()} ${slot.getStartTime()}`,
        "YYYY-MM-DD HH:mm",
        tz
      );

    return slotDateTime.isAfter(now);
  });
  console.log(
  "NOW:",
  now.format()
);

console.log(
  "TOTAL SLOTS:",
  allSlots.length
);

console.log(
  "FUTURE SLOTS:",
  futureSlots.length
);

const uniqueSlots =
  this.availabilityService.deduplicateSlots(
    futureSlots
  );

return this.availabilityService.filterAvailableSlots(
  uniqueSlots,
  appointments
);
  }
}
