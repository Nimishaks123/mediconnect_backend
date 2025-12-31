// application/interfaces/appointments/IGetDoctorAvailabilityUseCase.ts
import { GetDoctorAvailabilityDTO, GetDoctorAvailabilityResponseDTO } from "../../dtos/appointments/GetDoctorAvailabilityDTO";
export interface IGetDoctorAvailabilityUseCase {
  execute(input: GetDoctorAvailabilityDTO):Promise<GetDoctorAvailabilityResponseDTO[]>
}
