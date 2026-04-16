import { CreatePatientProfileDTO } from "../../dtos/patient/CreatePatientProfileDTO";
import { CreatePatientProfileResponseDTO } from "../../dtos/patient/CreatePatientProfileResponseDTO";

export interface ICreatePatientProfileUseCase {
    execute(data: CreatePatientProfileDTO): Promise<CreatePatientProfileResponseDTO>;
}
