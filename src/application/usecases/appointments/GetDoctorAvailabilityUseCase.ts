// application/usecases/appointments/GetDoctorAvailabilityUseCase.ts
import { GetDoctorAvailabilityDTO } from "@application/dtos/appointments/GetDoctorAvailabilityDTO";
import { GetDoctorAvailabilityResponseDTO } from "@application/dtos/appointments/GetDoctorAvailabilityDTO";
import { IGetDoctorAvailabilityUseCase } from "@application/interfaces/appointments/IGetDoctorAvailabilityUseCase";
import { IDoctorAvailabilityRepository } from "@domain/interfaces/IDoctorAvailabilityRepository";
import { AppError } from "@common/AppError";

export class GetDoctorAvailabilityUseCase
  implements IGetDoctorAvailabilityUseCase
{
  constructor(
    private readonly availabilityRepo: IDoctorAvailabilityRepository
  ) {}

  async execute(
    input: GetDoctorAvailabilityDTO
  ): Promise<GetDoctorAvailabilityResponseDTO[]> {
    const { doctorId, date } = input;

    // 1️⃣ Fetch available (not booked) slots
    const slots =
      await this.availabilityRepo.findAvailableSlots(
        doctorId,
        date
      );

    // 2️⃣ Map domain entities → response DTOs
    return slots.map((slot) => ({
      id: slot.getId()!,
      date: slot.getDate(),
      startTime: slot.getStartTime(),
      endTime: slot.getEndTime(),
    }));
  }
}
