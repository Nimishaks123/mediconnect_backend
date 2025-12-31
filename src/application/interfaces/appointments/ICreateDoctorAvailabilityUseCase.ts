// application/interfaces/appointments/ICreateDoctorAvailabilityUseCase.ts
import { CreateDoctorAvailabilityDTO } from "../../dtos/appointments/CreateDoctorAvailabilityDTO";

export interface ICreateDoctorAvailabilityUseCase {
  execute(input: CreateDoctorAvailabilityDTO): Promise<void>;
}
