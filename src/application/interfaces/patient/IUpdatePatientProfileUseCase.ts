import { UpdatePatientProfileDTO } from "../../dtos/patient/UpdatePatientProfileDTO";
import { UpdatePatientProfileResponseDTO } from "../../usecases/patient/UpdatePatientProfileUseCase";

export interface IUpdatePatientProfileUseCase {
    execute(input: UpdatePatientProfileDTO): Promise<UpdatePatientProfileResponseDTO>;
}
