import { GetPatientProfileDTO } from "../../dtos/patient/GetPatientProfileDTO";
import { GetPatientProfileResponseDTO } from "../../dtos/patient/GetPatientProfileResponseDTO";

export interface IGetPatientProfileUseCase {
    execute(input: GetPatientProfileDTO): Promise<GetPatientProfileResponseDTO>;
}
