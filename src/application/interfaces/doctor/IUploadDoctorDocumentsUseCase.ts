import { UploadDoctorDocumentsDTO } from "../../dtos/doctor/UploadDoctorDocumentsDTO";
import { UploadDoctorDocumentsResponseDTO } from "../../dtos/doctor/UploadDoctorDocumentsResponseDTO";

export interface IUploadDoctorDocumentsUseCase {
  execute(input: UploadDoctorDocumentsDTO): Promise<UploadDoctorDocumentsResponseDTO>;
}
