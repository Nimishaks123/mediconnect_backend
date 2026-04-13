import { RejectDoctorDTO, RejectDoctorResponseDTO } from "@application/dtos/admin/RejectDoctorDTO";

export interface IRejectDoctorUseCase {
  execute(dto: RejectDoctorDTO): Promise<RejectDoctorResponseDTO>;
}
