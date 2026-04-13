// src/application/interfaces/admin/IApproveDoctorUseCase.ts
import { ApproveRejectDoctorDTO, ApproveRejectDoctorResponseDTO } from "@application/dtos/admin/ApproveRejectDoctorDTO";

export interface IApproveDoctorUseCase {
  execute(dto: ApproveRejectDoctorDTO): Promise<ApproveRejectDoctorResponseDTO>;
}
