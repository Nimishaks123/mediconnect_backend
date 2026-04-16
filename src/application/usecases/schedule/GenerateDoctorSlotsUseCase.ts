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
    // 🔗 Fetch Doctor Context: Try finding by Profile ID first, then fallback to User ID
    let doctor = await this.doctorRepository.findById(doctorId);
    if (!doctor) {
      doctor = await this.doctorRepository.findByUserId(doctorId);
    }
    
    if (!doctor) {
      console.warn(`[GenerateDoctorSlots] Doctor not found with ID: ${doctorId}`);
      throw new AppError(MESSAGES.DOCTOR_PROFILE_NOT_FOUND, StatusCode.NOT_FOUND);
    }

    const doctorProfileId = doctor.getId();

    const [schedules, appointments] = await Promise.all([
      this.scheduleRepository.findByDoctorId(doctorProfileId),
      this.appointmentRepository.findByDoctorAndDateRange(
        doctorProfileId,
        queryRange.from.toISOString().split("T")[0],
        queryRange.to.toISOString().split("T")[0]
      )
    ]);
    
    console.log(`[GenerateDoctorSlots] ID: ${doctorProfileId}, Schedules found: ${schedules.length}`);

    if (schedules.length === 0) return [];

    // 🧬 Domain Generation: Delegate to aggregate roots
    const allSlots = schedules.flatMap(schedule => 
      schedule.generateSlots(queryRange, this.rrulePolicy)
    );
    const uniqueSlots = this.availabilityService.deduplicateSlots(allSlots);
    return this.availabilityService.filterAvailableSlots(uniqueSlots, appointments);
  }
}
