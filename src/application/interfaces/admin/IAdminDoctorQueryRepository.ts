import { AdminDoctorListResponseDTO } from "../../dtos/admin/AdminDoctorListDTO";

export interface IAdminDoctorQueryRepository {
  getAdminDoctors(
    status: string,
    page: number, 
    limit: number, 
    search?: string, 
    sort?: "NEWEST" | "OLDEST"
  ): Promise<AdminDoctorListResponseDTO>;
}
