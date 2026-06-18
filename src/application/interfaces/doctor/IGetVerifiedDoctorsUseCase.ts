import { GetVerifiedDoctorsDTO } from "@application/dtos/doctor/GetVerifiedDoctorsDTO";
import { DoctorResponseDTO } from "@application/dtos/doctor/DoctorResponseDTO";
import { VerifiedDoctorResponseDTO } from "@application/dtos/doctor/VerifiedDoctorResponseDTO";
export interface IGetVerifiedDoctorsUseCase{
  execute(dto:GetVerifiedDoctorsDTO):Promise<{doctors:VerifiedDoctorResponseDTO[],total:number}>;
}