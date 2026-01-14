import { DoctorAvailability } from "@domain/entities/DoctorAvailability";
import { IDoctorAvailabilityRepository } from "@domain/interfaces/IDoctorAvailabilityRepository";
import { IDoctorScheduleRepository } from "@domain/interfaces/IDoctorScheduleRepository";
import { GenerateDoctorAvailabilityUseCase } from "./GenerateDoctorAvailabilityUseCase";

export class GetDoctorAvailabilityUseCase {
  constructor(
    private readonly scheduleRepo: IDoctorScheduleRepository,
    private readonly availabilityRepo: IDoctorAvailabilityRepository,
    private readonly generateAvailabilityUseCase: GenerateDoctorAvailabilityUseCase
  ) {}

  async execute(
    doctorId: string,
    date: string
  ): Promise<DoctorAvailability[]> {
    //  Get doctor schedule
    const schedule = await this.scheduleRepo.findByDoctorId(doctorId);

    if (!schedule) {
      return [];
    }

    //  Generate slots for that date 
    const fromDate = new Date(date);
    const toDate = new Date(date);

    const generatedSlots =
      this.generateAvailabilityUseCase.execute(
        schedule,
        fromDate,
        toDate
      );

    // Persist generated slots 
    await this.availabilityRepo.createMany(generatedSlots);

    //  Fetch only available slots
    return this.availabilityRepo.findAvailableSlots(
      doctorId,
      date
    );
  }
}
