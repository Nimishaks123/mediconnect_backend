import { GetDoctorProfileDTO } from "../../dtos/doctor/GetDoctorProfileDTO";
import { GetDoctorProfileResponseDTO } from "../../dtos/doctor/GetDoctorProfileDTO";

export interface IGetDoctorProfileUseCase {
  execute(input: GetDoctorProfileDTO): Promise<GetDoctorProfileResponseDTO>;
}
