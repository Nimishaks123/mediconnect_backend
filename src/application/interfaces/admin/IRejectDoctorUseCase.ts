// src/application/interfaces/admin/IRejectDoctorUseCase.ts
import { ApproveRejectDoctorDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
import { ApproveRejectDoctorResponseDTO } from "@application/dtos/admin/ApproveRejectDoctorResponseDTO";

export interface IRejectDoctorUseCase {
  execute(dto: ApproveRejectDoctorDTO): Promise<ApproveRejectDoctorResponseDTO>;
}
