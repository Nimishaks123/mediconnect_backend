import { AdminDoctorListResponseDTO } from "../../dtos/admin/AdminDoctorListDTO";
import { IAdminDoctorQueryRepository } from "../../interfaces/admin/IAdminDoctorQueryRepository";

export interface GetAdminDoctorsInputDTO {
  status: "PENDING" | "APPROVED" | "REJECTED";
  page: number;
  limit: number;
  search?: string;
  sort?: "NEWEST" | "OLDEST";
}

export class GetAdminDoctorsUseCase {
  constructor(private readonly adminDoctorQueryRepo: IAdminDoctorQueryRepository) {}

  async execute(input: GetAdminDoctorsInputDTO): Promise<AdminDoctorListResponseDTO> {
    const page = Math.max(1, Number(input.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(input.limit) || 10));
    const sort = input.sort === "OLDEST" ? "OLDEST" : "NEWEST";
    const status = input.status || "PENDING";

    return await this.adminDoctorQueryRepo.getAdminDoctors(
      status, 
      page, 
      limit, 
      input.search, 
      sort
    );
  }
}
