import { StartDoctorOnboardingDTO } from "../../dtos/doctor/StartDoctorOnboardingDTO";
import { StartDoctorOnboardingResponseDTO } from "../../dtos/doctor/StartDoctorOnboardingDTO";

export interface IStartDoctorOnboardingUseCase {
  execute(input: StartDoctorOnboardingDTO): Promise<StartDoctorOnboardingResponseDTO>;
}
