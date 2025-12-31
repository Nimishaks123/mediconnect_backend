// application/usecases/appointments/CreateDoctorAvailabilityUseCase.ts
import { CreateDoctorAvailabilityDTO } from "@application/dtos/appointments/CreateDoctorAvailabilityDTO";
import { ICreateDoctorAvailabilityUseCase } from "@application/interfaces/appointments/ICreateDoctorAvailabilityUseCase";
import { IDoctorAvailabilityRepository } from "@domain/interfaces/IDoctorAvailabilityRepository";
import { DoctorAvailability } from "@domain/entities/DoctorAvailability";
import { AppError } from "@common/AppError";

export class CreateDoctorAvailabilityUseCase
  implements ICreateDoctorAvailabilityUseCase
{
  constructor(
    private readonly availabilityRepo: IDoctorAvailabilityRepository
  ) {}

  async execute(input: CreateDoctorAvailabilityDTO): Promise<void> {
    const { doctorId, date, slots } = input;

    if (!slots || slots.length === 0) {
      throw new AppError(
        "At least one availability slot is required",
        400
      );
    }

    // 1️⃣ Create domain entities
    const availabilitySlots = slots.map(
      (slot) =>
        new DoctorAvailability(
          null,
          doctorId,
          date,
          slot.startTime,
          slot.endTime
        )
    );

    // 2️⃣ Persist slots
    await this.availabilityRepo.createMany(
      availabilitySlots
    );
  }
}
