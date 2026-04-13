import { IDoctorScheduleRepository } from "@domain/interfaces/IDoctorScheduleRepository";
import { IAppointmentRepository } from "@domain/interfaces/IAppointmentRepository";
import { IDoctorRepository } from "@domain/interfaces/IDoctorRepository";
import { AppError } from "@common/AppError";
import { MESSAGES } from "@common/constants";
import { StatusCode } from "@common/enums";
import { DateRange } from "@domain/value-objects/DateRange";
import { SlotAvailabilityService } from "@domain/services/SlotAvailabilityService";
import { IRRulePolicy } from "@domain/policies/IRRulePolicy";

export class GetDoctorSlotsWithBookingUseCase {
  constructor(
    private readonly scheduleRepository: IDoctorScheduleRepository,
    private readonly appointmentRepository: IAppointmentRepository,
    private readonly doctorRepository: IDoctorRepository,
    private readonly availabilityService: SlotAvailabilityService,
    private readonly rrulePolicy: IRRulePolicy
  ) {}

  async execute({
    doctorUserId,
    from,
    to,
  }: {
    doctorUserId: string;
    from: string;
    to: string;
  }): Promise<any[]> {
  
    const range = DateRange.create(from, to);
    const doctor = await this.doctorRepository.findByUserId(doctorUserId);
    if (!doctor) {
      throw new AppError(MESSAGES.DOCTOR_PROFILE_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const doctorProfileId = doctor.getId();
    const [schedules, appointments] = await Promise.all([
      this.scheduleRepository.findByDoctorId(doctorProfileId),
      this.appointmentRepository.findByDoctorAndDateRange(
        doctorProfileId,
        range.from.toISOString().split("T")[0],
        range.to.toISOString().split("T")[0]
      )
    ]);

    if (schedules.length === 0) return [];
    const allSlots = schedules.flatMap(schedule => 
      schedule.generateSlots(range, this.rrulePolicy)
    );

    const uniqueSlots = this.availabilityService.deduplicateSlots(allSlots);
    return this.availabilityService.mapSlotsWithBookings(uniqueSlots, appointments);
  }
}