import { VerifiedDoctorResponseDTO } from "@application/dtos/doctor/VerifiedDoctorResponseDTO";

export interface IGetVerifiedDoctorsUseCase {
  execute(): Promise<VerifiedDoctorResponseDTO[]>;
}
