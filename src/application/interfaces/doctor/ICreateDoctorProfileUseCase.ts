import { CreateDoctorProfileDTO } from "../../dtos/doctor/CreateDoctorProfileDTO";
import { CreateDoctorProfileResponseDTO } from "../../dtos/doctor/CreateDoctorProfileResponseDTO";

export interface ICreateDoctorProfileUseCase {
  execute(input: CreateDoctorProfileDTO): Promise<CreateDoctorProfileResponseDTO>;
}
