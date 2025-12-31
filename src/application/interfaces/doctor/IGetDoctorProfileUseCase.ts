import { GetDoctorProfileDTO } from "../../dtos/doctor/GetDoctorProfileDTO";
import { GetDoctorProfileResponseDTO } from "../../dtos/doctor/GetDoctorProfileResponseDTO";

export interface IGetDoctorProfileUseCase {
  execute(input: GetDoctorProfileDTO): Promise<GetDoctorProfileResponseDTO>;
}
