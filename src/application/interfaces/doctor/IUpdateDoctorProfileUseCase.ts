import { UpdateDoctorProfileDTO } from "../../dtos/doctor/UpdateDoctorProfileDTO";
import { UpdateDoctorProfileResponseDTO } from "../../dtos/doctor/UpdateDoctorProfileResponseDTO";

export interface IUpdateDoctorProfileUseCase {
  execute(input: UpdateDoctorProfileDTO): Promise<UpdateDoctorProfileResponseDTO>;
}
