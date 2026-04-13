import { UpdateDoctorProfileDTO } from "../../dtos/doctor/UpdateDoctorProfileDTO";
import { UpdateDoctorProfileResponseDTO } from "../../dtos/doctor/UpdateDoctorProfileDTO";

export interface IUpdateDoctorProfileUseCase {
  execute(input: UpdateDoctorProfileDTO): Promise<UpdateDoctorProfileResponseDTO>;
}
