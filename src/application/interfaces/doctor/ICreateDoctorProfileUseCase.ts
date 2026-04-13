import { CreateDoctorProfileDTO } from "../../dtos/doctor/CreateDoctorProfileDTO";
import { CreateDoctorProfileResponseDTO } from "../../dtos/doctor/CreateDoctorProfileDTO";

export interface ICreateDoctorProfileUseCase {
  execute(input: CreateDoctorProfileDTO): Promise<CreateDoctorProfileResponseDTO>;
}
