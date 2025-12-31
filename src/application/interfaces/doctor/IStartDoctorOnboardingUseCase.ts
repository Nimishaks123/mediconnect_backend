import { StartDoctorOnboardingDTO } from "../../dtos/doctor/StartDoctorOnboardingDTO";
import { StartDoctorOnboardingResponseDTO } from "../../dtos/doctor/StartDoctorOnboardingResponseDTO";

export interface IStartDoctorOnboardingUseCase {
  execute(input: StartDoctorOnboardingDTO): Promise<StartDoctorOnboardingResponseDTO>;
}
