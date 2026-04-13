import { AdminDoctorListResponseDTO } from "../../dtos/admin/AdminDoctorListDTO";
import { GetAdminDoctorsInputDTO } from "../../usecases/admin/GetAdminDoctorsUseCase";

export interface IGetAdminDoctorsUseCase {
  execute(input: GetAdminDoctorsInputDTO): Promise<AdminDoctorListResponseDTO>;
}
