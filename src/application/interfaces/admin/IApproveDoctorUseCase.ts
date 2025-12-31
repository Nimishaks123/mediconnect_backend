// src/application/interfaces/admin/IApproveDoctorUseCase.ts
import { ApproveRejectDoctorDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";
import { ApproveRejectDoctorResponseDTO } from "@application/dtos/admin/ApproveRejectDoctorResponseDTO";

export interface IApproveDoctorUseCase {
  execute(dto: ApproveRejectDoctorDTO): Promise<ApproveRejectDoctorResponseDTO>;
}
