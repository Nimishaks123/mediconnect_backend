import { UploadDoctorDocumentsDTO } from "../../dtos/doctor/UploadDoctorDocumentsDTO";
import { UploadDoctorDocumentsResponseDTO } from "../../dtos/doctor/UploadDoctorDocumentsDTO";

export interface IUploadDoctorDocumentsUseCase {
  execute(input: UploadDoctorDocumentsDTO): Promise<UploadDoctorDocumentsResponseDTO>;
}
